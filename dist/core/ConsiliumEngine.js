import { UniversalLlmClient } from './UniversalLlmClient.js';
import { CORPORATE_ROLES, KnowledgeBaseConnector } from './CorporateRoles.js';
import { Config } from './Config.js';
import { logger } from './Logger.js';
export class ConsiliumEngine {
    client;
    kbConnector;
    constructor(apiKey) {
        this.client = new UniversalLlmClient(apiKey);
        this.kbConnector = new KnowledgeBaseConnector();
    }
    /**
     * Main entrypoint for running any Consilium engine mode
     */
    async run(options) {
        const startTime = Date.now();
        logger.info('ConsiliumEngine', `Starting execution: mode=${options.mode}, rounds=${options.rounds || 1}`);
        // Fetch hybrid DB context if enabled
        let kbContext = '';
        let kbIncluded = false;
        if (options.useKnowledgeBase) {
            try {
                const docs = await this.kbConnector.search(options.prompt, { limit: 3 });
                if (docs.length > 0) {
                    kbContext = this.kbConnector.formatContextForPrompt(docs);
                    kbIncluded = true;
                    logger.info('ConsiliumEngine', `Injected ${docs.length} hybrid DB knowledge documents into context`);
                }
            }
            catch (err) {
                logger.warn('ConsiliumEngine', `Failed retrieving knowledge base: ${err.message}`);
            }
        }
        const participants = this.resolveParticipants(options);
        let result;
        switch (options.mode) {
            case 'solo':
                result = await this.runSolo(options, participants, kbContext, startTime, kbIncluded);
                break;
            case 'broadcast':
                result = await this.runBroadcast(options, participants, kbContext, startTime, kbIncluded);
                break;
            case 'dialogue':
                result = await this.runDialogue(options, participants, kbContext, startTime, kbIncluded);
                break;
            case 'consilium':
                result = await this.runConsilium(options, participants, kbContext, startTime, kbIncluded);
                break;
            default:
                throw new Error(`Unsupported Consilium mode: ${options.mode}`);
        }
        return result;
    }
    /**
     * Resolves and enriches participants list with corporate roles and defaults
     */
    resolveParticipants(options) {
        if (options.participants && options.participants.length > 0) {
            return options.participants.map((p, idx) => {
                const role = p.roleId && CORPORATE_ROLES[p.roleId] ? CORPORATE_ROLES[p.roleId] : undefined;
                return {
                    id: p.id || `participant-${idx + 1}`,
                    model: p.model || Config.defaultModel,
                    roleId: p.roleId,
                    name: p.name || role?.name || `Agent ${idx + 1}`,
                    title: p.title || role?.title || 'Specialist',
                    systemPrompt: p.systemPrompt || role?.systemPrompt || Config.defaultSystemInstruction,
                    temperature: p.temperature ?? role?.suggestedTemperature ?? 0.5,
                    provider: p.provider,
                };
            });
        }
        const modelList = options.models && options.models.length > 0
            ? options.models
            : [Config.defaultModel];
        const defaultRoleKeys = Object.keys(CORPORATE_ROLES);
        return modelList.map((model, idx) => {
            const roleKey = defaultRoleKeys[idx % defaultRoleKeys.length];
            const role = CORPORATE_ROLES[roleKey];
            return {
                id: `agent-${idx + 1}-${role.id}`,
                model,
                roleId: role.id,
                name: role.name,
                title: role.title,
                systemPrompt: role.systemPrompt,
                temperature: role.suggestedTemperature,
            };
        });
    }
    /**
     * Validates and bounds participants for Consilium mode (strictly between 3 and 10 participants)
     */
    validateConsiliumParticipants(participants) {
        let activeParticipants = [...participants];
        if (activeParticipants.length < 3) {
            // Expand up to 3 minimum with corporate roles
            const extraRoles = ['architect', 'devops', 'security_auditor'];
            while (activeParticipants.length < 3) {
                const role = CORPORATE_ROLES[extraRoles[activeParticipants.length % extraRoles.length]];
                activeParticipants.push({
                    id: `consilium-agent-${activeParticipants.length + 1}`,
                    model: role.preferredModel,
                    roleId: role.id,
                    name: role.name,
                    title: role.title,
                    systemPrompt: role.systemPrompt,
                    temperature: role.suggestedTemperature,
                });
            }
        }
        else if (activeParticipants.length > 10) {
            // Bound to maximum 10 participants
            activeParticipants = activeParticipants.slice(0, 10);
        }
        return activeParticipants;
    }
    /**
     * Mode 1: Solo Mode (Standard 1-on-1 execution)
     */
    async runSolo(options, participants, kbContext, startTime, kbIncluded) {
        const participant = participants[0] || {
            id: 'solo-agent',
            model: Config.defaultModel,
            name: 'EvaBot Solo Agent',
            title: 'AI Specialist',
            systemPrompt: Config.defaultSystemInstruction,
            temperature: 0.7,
        };
        options.onProgress?.({
            type: 'turn_start',
            round: 1,
            participantId: participant.id,
            message: `${participant.name} is formulating response...`,
        });
        const turnStart = Date.now();
        const effectivePrompt = kbContext ? `${kbContext}\n\nUser Request: ${options.prompt}` : options.prompt;
        let response;
        try {
            response = await this.client.generateContent(participant.model, [{ role: 'user', content: effectivePrompt }], {
                temperature: participant.temperature,
                systemInstruction: participant.systemPrompt,
                apiKey: options.apiKey,
                signal: options.signal,
            });
        }
        catch (err) {
            logger.error('ConsiliumEngine', `Solo execution error on ${participant.model}: ${err.message}`);
            response = `[Error querying model ${participant.model}: ${err.message}]`;
        }
        const turn = {
            round: 1,
            participantId: participant.id,
            name: participant.name || 'EvaBot',
            model: participant.model,
            role: participant.title,
            content: response,
            timestamp: new Date().toISOString(),
            durationMs: Date.now() - turnStart,
        };
        options.onProgress?.({
            type: 'turn_complete',
            round: 1,
            participantId: participant.id,
            turn,
        });
        return {
            mode: 'solo',
            prompt: options.prompt,
            participants: [participant],
            turns: [turn],
            totalRounds: 1,
            durationMs: Date.now() - startTime,
            knowledgeBaseContextIncluded: kbIncluded,
        };
    }
    /**
     * Mode 2: Broadcast Mode (Query N models concurrently)
     */
    async runBroadcast(options, participants, kbContext, startTime, kbIncluded) {
        const effectivePrompt = kbContext ? `${kbContext}\n\nUser Request: ${options.prompt}` : options.prompt;
        options.onProgress?.({
            type: 'round_complete',
            round: 1,
            message: `Broadcasting prompt concurrently to ${participants.length} models...`,
        });
        const promises = participants.map(async (p) => {
            const turnStart = Date.now();
            options.onProgress?.({
                type: 'turn_start',
                round: 1,
                participantId: p.id,
                message: `${p.name} (${p.model}) is processing broadcast request...`,
            });
            try {
                const content = await this.client.generateContent(p.model, [{ role: 'user', content: effectivePrompt }], {
                    temperature: p.temperature,
                    systemInstruction: p.systemPrompt,
                    apiKey: options.apiKey,
                    signal: options.signal,
                });
                const turn = {
                    round: 1,
                    participantId: p.id,
                    name: p.name || p.id,
                    model: p.model,
                    role: p.title,
                    content,
                    timestamp: new Date().toISOString(),
                    durationMs: Date.now() - turnStart,
                };
                options.onProgress?.({
                    type: 'turn_complete',
                    round: 1,
                    participantId: p.id,
                    turn,
                });
                return turn;
            }
            catch (err) {
                logger.error('ConsiliumEngine', `Broadcast error on participant ${p.id} (${p.model}): ${err.message}`);
                const failedTurn = {
                    round: 1,
                    participantId: p.id,
                    name: p.name || p.id,
                    model: p.model,
                    role: p.title,
                    content: `[Error querying model ${p.model}: ${err.message}]`,
                    timestamp: new Date().toISOString(),
                    durationMs: Date.now() - turnStart,
                };
                return failedTurn;
            }
        });
        const turns = await Promise.all(promises);
        return {
            mode: 'broadcast',
            prompt: options.prompt,
            participants,
            turns,
            totalRounds: 1,
            durationMs: Date.now() - startTime,
            knowledgeBaseContextIncluded: kbIncluded,
        };
    }
    /**
     * Mode 3: Dual-model Dialogue Mode (2 models exchange arguments over K rounds)
     */
    async runDialogue(options, participants, kbContext, startTime, kbIncluded) {
        const p1 = participants[0] || {
            id: 'agent-1',
            model: 'gemini-2.5-pro',
            name: 'Lead Proponent',
            title: 'Lead Architect',
            systemPrompt: CORPORATE_ROLES.architect.systemPrompt,
            temperature: 0.4,
        };
        const p2 = participants[1] || {
            id: 'agent-2',
            model: 'gemini-2.5-flash',
            name: 'Lead Challenger',
            title: 'Principal Security & Risk Auditor',
            systemPrompt: CORPORATE_ROLES.security_auditor.systemPrompt,
            temperature: 0.4,
        };
        const totalRounds = Math.max(1, Math.min(options.rounds || 2, 5));
        const turns = [];
        const dialogueHistory = [];
        const effectivePrompt = kbContext ? `${kbContext}\n\nTopic for Technical Deliberation: ${options.prompt}` : options.prompt;
        dialogueHistory.push({ role: 'user', content: effectivePrompt });
        for (let round = 1; round <= totalRounds; round++) {
            // Participant 1's turn
            const t1Start = Date.now();
            options.onProgress?.({
                type: 'turn_start',
                round,
                participantId: p1.id,
                message: `Round ${round}/${totalRounds}: ${p1.name} is presenting arguments...`,
            });
            const p1Prompt = round === 1
                ? effectivePrompt
                : `Round ${round} Counter-Argument: Review the previous reply and defend or refine your architectural stance:\n\n${dialogueHistory[dialogueHistory.length - 1].content}`;
            let p1Response = '';
            try {
                p1Response = await this.client.generateContent(p1.model, [...dialogueHistory, { role: 'user', content: p1Prompt }], {
                    temperature: p1.temperature,
                    systemInstruction: `${p1.systemPrompt}\nYou are participating in a bilateral technical dialogue with ${p2.name} (${p2.title}). Maintain intellectual rigor, focus on concrete trade-offs, and defend your positions with evidence.`,
                    apiKey: options.apiKey,
                    signal: options.signal,
                });
            }
            catch (err) {
                logger.error('ConsiliumEngine', `Dialogue turn error for ${p1.name}: ${err.message}`);
                p1Response = `[Error generating argument from ${p1.name}: ${err.message}]`;
            }
            const turn1 = {
                round,
                participantId: p1.id,
                name: p1.name || p1.id,
                model: p1.model,
                role: p1.title,
                content: p1Response,
                timestamp: new Date().toISOString(),
                durationMs: Date.now() - t1Start,
            };
            turns.push(turn1);
            dialogueHistory.push({ role: 'assistant', content: `[${p1.name}]: ${p1Response}` });
            options.onProgress?.({
                type: 'turn_complete',
                round,
                participantId: p1.id,
                turn: turn1,
            });
            // Participant 2's turn
            const t2Start = Date.now();
            options.onProgress?.({
                type: 'turn_start',
                round,
                participantId: p2.id,
                message: `Round ${round}/${totalRounds}: ${p2.name} is responding and critiquing...`,
            });
            const p2Prompt = `Round ${round} Critique: Directly address the arguments posed by ${p1.name} above. Point out vulnerabilities, edge cases, cost implications in USD/EUR, and suggest counter-proposals:\n\n${p1Response}`;
            let p2Response = '';
            try {
                p2Response = await this.client.generateContent(p2.model, [...dialogueHistory, { role: 'user', content: p2Prompt }], {
                    temperature: p2.temperature,
                    systemInstruction: `${p2.systemPrompt}\nYou are participating in a bilateral technical dialogue with ${p1.name} (${p1.title}). Critically analyze their statements, probe for weak spots, and propose resilient solutions.`,
                    apiKey: options.apiKey,
                    signal: options.signal,
                });
            }
            catch (err) {
                logger.error('ConsiliumEngine', `Dialogue turn error for ${p2.name}: ${err.message}`);
                p2Response = `[Error generating argument from ${p2.name}: ${err.message}]`;
            }
            const turn2 = {
                round,
                participantId: p2.id,
                name: p2.name || p2.id,
                model: p2.model,
                role: p2.title,
                content: p2Response,
                timestamp: new Date().toISOString(),
                durationMs: Date.now() - t2Start,
            };
            turns.push(turn2);
            dialogueHistory.push({ role: 'assistant', content: `[${p2.name}]: ${p2Response}` });
            options.onProgress?.({
                type: 'turn_complete',
                round,
                participantId: p2.id,
                turn: turn2,
            });
        }
        // Synthesize final dialogue outcome
        const synthModel = options.synthesizerModel || 'gemini-2.5-pro';
        options.onProgress?.({
            type: 'synthesis_start',
            message: `Synthesizing final dialogue conclusion with ${synthModel}...`,
        });
        const synthPrompt = `You are the Senior Technical Arbiter. Synthesize the debate between ${p1.name} and ${p2.name} on the topic:\n"${options.prompt}"\n\n` +
            `Deliberation Transcript:\n` +
            turns.map((t) => `### Round ${t.round} - ${t.name} (${t.role}):\n${t.content}`).join('\n\n') +
            `\n\nProduce an authoritative Executive Synthesis with:\n` +
            `1. Core Points of Consensus\n` +
            `2. Unresolved Trade-Offs & Edge Cases\n` +
            `3. Definitive Actionable Recommendation (with cost impact in USD ($) or EUR (€)).`;
        let synthesis = '';
        try {
            synthesis = await this.client.generateContent(synthModel, [{ role: 'user', content: synthPrompt }], {
                temperature: 0.2,
                systemInstruction: Config.defaultSystemInstruction,
                apiKey: options.apiKey,
                signal: options.signal,
            });
        }
        catch (err) {
            logger.error('ConsiliumEngine', `Dialogue synthesis error: ${err.message}`);
            synthesis = `[Dialogue synthesis generation error: ${err.message}]`;
        }
        options.onProgress?.({
            type: 'synthesis_complete',
            message: 'Dialogue synthesis completed.',
        });
        return {
            mode: 'dialogue',
            prompt: options.prompt,
            participants: [p1, p2],
            turns,
            synthesis,
            totalRounds,
            durationMs: Date.now() - startTime,
            knowledgeBaseContextIncluded: kbIncluded,
        };
    }
    /**
     * Mode 4: Consilium Mode (3 to 10 models discuss in rounds, then synthesizer produces consensus)
     */
    async runConsilium(options, participants, kbContext, startTime, kbIncluded) {
        // Validate bounds: 3 to 10 participants
        const activeParticipants = this.validateConsiliumParticipants(participants);
        const totalRounds = Math.max(1, Math.min(options.rounds || 2, 4));
        const turns = [];
        const effectivePrompt = kbContext ? `${kbContext}\n\nConsilium Mandate / Technical Challenge: ${options.prompt}` : options.prompt;
        // Round 1: Independent vantage evaluations (concurrent)
        logger.info('ConsiliumEngine', `Consilium Round 1: ${activeParticipants.length} agents evaluating concurrently`);
        options.onProgress?.({
            type: 'round_complete',
            round: 1,
            message: `Consilium Round 1: ${activeParticipants.length} agents providing independent expert perspectives...`,
        });
        const round1Promises = activeParticipants.map(async (p) => {
            const turnStart = Date.now();
            options.onProgress?.({
                type: 'turn_start',
                round: 1,
                participantId: p.id,
                message: `${p.name} (${p.title}) is drafting Round 1 stance...`,
            });
            const userMsg = `Please analyze the following challenge from your specific professional perspective as ${p.title}:\n\n"${effectivePrompt}"\n\nState your primary recommendations, essential prerequisites, and critical risks.`;
            try {
                const content = await this.client.generateContent(p.model, [{ role: 'user', content: userMsg }], {
                    temperature: p.temperature,
                    systemInstruction: p.systemPrompt,
                    apiKey: options.apiKey,
                    signal: options.signal,
                });
                const turn = {
                    round: 1,
                    participantId: p.id,
                    name: p.name || p.id,
                    model: p.model,
                    role: p.title,
                    content,
                    timestamp: new Date().toISOString(),
                    durationMs: Date.now() - turnStart,
                };
                options.onProgress?.({
                    type: 'turn_complete',
                    round: 1,
                    participantId: p.id,
                    turn,
                });
                return turn;
            }
            catch (err) {
                logger.error('ConsiliumEngine', `Consilium Round 1 error for ${p.name}: ${err.message}`);
                return {
                    round: 1,
                    participantId: p.id,
                    name: p.name || p.id,
                    model: p.model,
                    role: p.title,
                    content: `[Perspective unavailable due to query error: ${err.message}]`,
                    timestamp: new Date().toISOString(),
                    durationMs: Date.now() - turnStart,
                };
            }
        });
        const round1Turns = await Promise.all(round1Promises);
        turns.push(...round1Turns);
        // Round 2 to K: Cross-deliberation & debate
        for (let r = 2; r <= totalRounds; r++) {
            logger.info('ConsiliumEngine', `Consilium Round ${r}: Cross-evaluation across ${activeParticipants.length} agents`);
            options.onProgress?.({
                type: 'round_complete',
                round: r,
                message: `Consilium Round ${r}: Deliberating on peers' statements and refining alignment...`,
            });
            const peerSummary = turns
                .filter((t) => t.round === r - 1)
                .map((t) => `[${t.name} - ${t.role}]:\n${t.content}`)
                .join('\n\n---\n\n');
            const roundPromises = activeParticipants.map(async (p) => {
                const turnStart = Date.now();
                options.onProgress?.({
                    type: 'turn_start',
                    round: r,
                    participantId: p.id,
                    message: `${p.name} is evaluating peers' input in Round ${r}...`,
                });
                const prompt = `You are participating in Round ${r} of the EvaLine Technical Consilium.\n` +
                    `Original Mandate: "${options.prompt}"\n\n` +
                    `Below are the stances delivered by your colleagues in the previous round:\n\n${peerSummary}\n\n` +
                    `Critique, support, or refine these viewpoints from your vantage as ${p.title}. Highlight consensus or irreconcilable trade-offs.`;
                try {
                    const content = await this.client.generateContent(p.model, [{ role: 'user', content: prompt }], {
                        temperature: p.temperature,
                        systemInstruction: p.systemPrompt,
                        apiKey: options.apiKey,
                        signal: options.signal,
                    });
                    const turn = {
                        round: r,
                        participantId: p.id,
                        name: p.name || p.id,
                        model: p.model,
                        role: p.title,
                        content,
                        timestamp: new Date().toISOString(),
                        durationMs: Date.now() - turnStart,
                    };
                    options.onProgress?.({
                        type: 'turn_complete',
                        round: r,
                        participantId: p.id,
                        turn,
                    });
                    return turn;
                }
                catch (err) {
                    logger.error('ConsiliumEngine', `Consilium Round ${r} error for ${p.name}: ${err.message}`);
                    return {
                        round: r,
                        participantId: p.id,
                        name: p.name || p.id,
                        model: p.model,
                        role: p.title,
                        content: `[Deliberation note unavailable: ${err.message}]`,
                        timestamp: new Date().toISOString(),
                        durationMs: Date.now() - turnStart,
                    };
                }
            });
            const currentRoundTurns = await Promise.all(roundPromises);
            turns.push(...currentRoundTurns);
        }
        // Final Stage: Synthesizer produces authoritative corporate consensus
        const synthModel = options.synthesizerModel || 'gemini-2.5-pro';
        logger.info('ConsiliumEngine', `Synthesizing final consensus with ${synthModel}`);
        options.onProgress?.({
            type: 'synthesis_start',
            message: `Consilium deliberation concluded. Synthesizing consensus document with ${synthModel}...`,
        });
        const fullTranscript = turns
            .map((t) => `### Round ${t.round} — ${t.name} (${t.role} / ${t.model}):\n${t.content}`)
            .join('\n\n');
        const synthesisPrompt = `You are the EvaLine Supreme Technical Council Synthesizer.\n` +
            `Your role is to formulate the definitive, binding consensus from a ${activeParticipants.length}-agent expert consilium.\n\n` +
            `Original Mandate:\n"${options.prompt}"\n\n` +
            `Consilium Transcript:\n${fullTranscript}\n\n` +
            `Formulate a comprehensive, structured Consilium Consensus Report strictly in Markdown:\n` +
            `## 1. Executive Summary & Final Verdict\n` +
            `## 2. Unanimous Consensus & Strategic Alignment\n` +
            `## 3. Disputed Decisions, Risk Analysis & Trade-Offs\n` +
            `## 4. Implementation Roadmap & Technical Milestones\n` +
            `## 5. Budgetary & Infrastructure Impact (strictly in USD ($) and EUR (€))\n`;
        let synthesis = '';
        try {
            synthesis = await this.client.generateContent(synthModel, [{ role: 'user', content: synthesisPrompt }], {
                temperature: 0.2,
                systemInstruction: Config.defaultSystemInstruction,
                apiKey: options.apiKey,
                signal: options.signal,
            });
        }
        catch (err) {
            logger.error('ConsiliumEngine', `Consilium synthesis error: ${err.message}`);
            synthesis = `[Consilium consensus synthesis generation error: ${err.message}]`;
        }
        options.onProgress?.({
            type: 'synthesis_complete',
            message: 'Consilium Consensus Report successfully generated.',
        });
        return {
            mode: 'consilium',
            prompt: options.prompt,
            participants: activeParticipants,
            turns,
            synthesis,
            totalRounds,
            durationMs: Date.now() - startTime,
            knowledgeBaseContextIncluded: kbIncluded,
        };
    }
}
