import { ModelRegistry } from './ModelRegistry.js';
export class ModelRatings {
    static computeRating(model) {
        const quality = this.computeQualityScore(model);
        const speed = this.computeSpeedScore(model);
        const context = this.computeContextScore(model);
        const cost = this.computeCostScore(model);
        const composite = Math.round(quality * 0.4 + speed * 0.25 + context * 0.2 + cost * 0.15);
        return {
            modelId: model.id,
            quality,
            speed,
            context,
            cost,
            composite,
        };
    }
    static computeQualityScore(model) {
        let score = 0;
        const name = model.name.toLowerCase();
        const id = model.id.toLowerCase();
        if (name.includes('claude 3.7') || name.includes('claude sonnet 4'))
            score += 95;
        else if (name.includes('gpt-4o'))
            score += 85;
        else if (name.includes('o1') || name.includes('o3-mini'))
            score += 90;
        else if (name.includes('claude 3.5'))
            score += 88;
        else if (name.includes('gemini 3.8') || name.includes('gemini 3.1'))
            score += 82;
        else if (name.includes('gemini 2.5 pro'))
            score += 78;
        else if (name.includes('gemini 2.5 flash'))
            score += 72;
        else if (name.includes('gemini 2.0'))
            score += 68;
        else if (name.includes('gemini 1.5 pro'))
            score += 65;
        else if (name.includes('gemini 1.5 flash'))
            score += 60;
        else if (name.includes('llama 3.3 70b'))
            score += 70;
        else if (name.includes('llama 3.1 405b'))
            score += 75;
        else if (name.includes('deepseek r1') || name.includes('deepseek v3'))
            score += 80;
        else if (name.includes('mistral large'))
            score += 70;
        else if (name.includes('gemma 2 27b'))
            score += 65;
        else if (name.includes('gemma 2 9b'))
            score += 55;
        else if (name.includes('codestral'))
            score += 60;
        else if (name.includes('qwen 2.5 coder 32b'))
            score += 68;
        else if (name.includes('groq') || name.includes('grok'))
            score += 70;
        else if (name.includes('jamba'))
            score += 60;
        else if (name.includes('command'))
            score += 58;
        else
            score += 40;
        if (model.recommended)
            score += 5;
        return Math.min(100, score);
    }
    static computeSpeedScore(model) {
        let score = 50;
        const details = model.pricing.freeTierDetails || '';
        const name = model.name.toLowerCase();
        if (details.includes('30 RPM'))
            score += 40;
        else if (details.includes('20 RPM'))
            score += 30;
        else if (details.includes('15 RPM'))
            score += 20;
        else if (details.includes('5 RPM'))
            score += 10;
        else if (details.includes('2 RPM'))
            score -= 20;
        if (name.includes('flash') || name.includes('lite') || name.includes('mini') || name.includes('haiku'))
            score += 15;
        if (name.includes('haiku'))
            score += 5;
        if (name.includes('gpt-4o-mini') || name.includes('gpt-3.5'))
            score += 10;
        if (name.includes('mistral-7b') || name.includes('llama 3.1 8b'))
            score += 20;
        return Math.max(0, Math.min(100, score));
    }
    static computeContextScore(model) {
        const ctx = model.contextWindow;
        if (ctx >= 2000000)
            return 100;
        if (ctx >= 1000000)
            return 90;
        if (ctx >= 256000)
            return 80;
        if (ctx >= 200000)
            return 70;
        if (ctx >= 128000)
            return 60;
        if (ctx >= 64000)
            return 50;
        if (ctx >= 32000)
            return 35;
        if (ctx >= 16000)
            return 25;
        if (ctx >= 8192)
            return 15;
        return 10;
    }
    static computeCostScore(model) {
        const isFree = model.pricing.freeTierStatus === '100% Free Quota Available';
        if (isFree)
            return 100;
        const inputPrice = model.pricing.inputPer1MTokensUSD;
        if (inputPrice.includes('$0.00'))
            return 95;
        if (inputPrice.includes('$0.075') || inputPrice.includes('$0.10'))
            return 80;
        if (inputPrice.includes('$0.14') || inputPrice.includes('$0.20'))
            return 70;
        if (inputPrice.includes('$0.30') || inputPrice.includes('$0.50'))
            return 60;
        if (inputPrice.includes('$0.70') || inputPrice.includes('$0.90'))
            return 50;
        if (inputPrice.includes('$1.25'))
            return 40;
        if (inputPrice.includes('$2.00') || inputPrice.includes('$2.50'))
            return 25;
        if (inputPrice.includes('$3.00') || inputPrice.includes('$3.50'))
            return 15;
        if (inputPrice.includes('$15.00'))
            return 5;
        return 30;
    }
    static rankByDimension(dimension, limit = 10, freeOnly = false) {
        let models = freeOnly ? ModelRegistry.getFreeModels() : ModelRegistry.getAllModels();
        const ratings = models.map((m) => ({
            model: m,
            rating: this.computeRating(m),
        }));
        ratings.sort((a, b) => {
            let aVal = 0, bVal = 0;
            switch (dimension) {
                case 'quality':
                    aVal = a.rating.quality;
                    bVal = b.rating.quality;
                    break;
                case 'speed':
                    aVal = a.rating.speed;
                    bVal = b.rating.speed;
                    break;
                case 'context':
                    aVal = a.rating.context;
                    bVal = b.rating.context;
                    break;
                case 'cost':
                    aVal = a.rating.cost;
                    bVal = b.rating.cost;
                    break;
            }
            return bVal - aVal;
        });
        return ratings.slice(0, limit).map((entry, idx) => ({
            rank: idx + 1,
            model: entry.model,
            rating: entry.rating,
            reason: this.getRankReason(entry.model, dimension),
        }));
    }
    static getTopOverall(freeOnly = false, limit = 10) {
        return this.rankByDimension('quality', limit, freeOnly);
    }
    static getTopFree(limit = 10) {
        return this.rankByDimension('quality', limit, true);
    }
    static getTopPaid(limit = 10) {
        return this.rankByDimension('quality', limit, false).filter(e => e.model.pricing.freeTierStatus === 'Paid / Pay-As-You-Go Only').slice(0, limit);
    }
    static getTopBySpeed(freeOnly = true, limit = 10) {
        return this.rankByDimension('speed', limit, freeOnly);
    }
    static getTopByContext(freeOnly = true, limit = 10) {
        return this.rankByDimension('context', limit, freeOnly);
    }
    static getRankReason(model, dim) {
        switch (dim) {
            case 'quality':
                if (model.name.toLowerCase().includes('claude 3.7'))
                    return 'Highest SWE-bench: 70.3%';
                if (model.name.toLowerCase().includes('deepseek r1'))
                    return 'Best open reasoning: 49.2%';
                if (model.name.toLowerCase().includes('gemini 3'))
                    return 'Next-gen flagship: 1M+ context';
                if (model.name.toLowerCase().includes('gemini 2.5 pro'))
                    return 'Premier 2M context reasoning';
                return 'High quality general LLM';
            case 'speed':
                if (model.pricing.freeTierDetails.includes('30 RPM'))
                    return 'Fastest free tier: 30 RPM';
                if (model.name.toLowerCase().includes('haiku'))
                    return 'Haiku-tier high speed';
                if (model.name.toLowerCase().includes('flash'))
                    return 'Flash-tier low latency';
                return 'High throughput';
            case 'context':
                if (model.contextWindow >= 2000000)
                    return '2M tokens max context';
                if (model.contextWindow >= 1000000)
                    return '1M tokens long context';
                if (model.contextWindow >= 256000)
                    return '256K tokens context';
                return `${model.contextWindow.toLocaleString()} tokens`;
            case 'cost':
                if (model.pricing.freeTierStatus === '100% Free Quota Available')
                    return '100% FREE';
                if (model.pricing.inputPer1MTokensUSD.includes('$0.00'))
                    return 'Free local routing';
                return 'Low input cost';
        }
    }
    static formatTopList(entries, title) {
        const lines = [];
        lines.push('');
        lines.push('═'.repeat(78));
        lines.push(`  ${title}`);
        lines.push('═'.repeat(78));
        lines.push('');
        for (const entry of entries) {
            const m = entry.model;
            const isFree = m.pricing.freeTierStatus === '100% Free Quota Available';
            const badge = isFree ? '[FREE]' : '[PAID]';
            const composite = entry.rating.composite.toString().padStart(3);
            lines.push(`  #${entry.rank.toString().padStart(2)} ${composite}/100  ${badge}  ${m.name}`);
            lines.push(`        ID: ${m.id}`);
            lines.push(`        Provider: ${m.provider}`);
            lines.push(`        Context: ${m.contextWindow.toLocaleString()} tokens | Output: ${m.maxOutputTokens} tokens`);
            lines.push(`        Quality: ${entry.rating.quality} | Speed: ${entry.rating.speed} | Context: ${entry.rating.context} | Cost: ${entry.rating.cost}`);
            lines.push(`        Reason: ${entry.reason}`);
            lines.push('');
        }
        return lines.join('\n');
    }
}
export class ModelCommand {
    static execute(command) {
        const cmd = command.toLowerCase().trim();
        const parts = cmd.split(/\s+/);
        const action = parts[0];
        switch (action) {
            case '/top':
                return this.handleTop(parts.slice(1));
            case '/free':
                return this.handleFree(parts.slice(1));
            case '/paid':
                return this.handlePaid(parts.slice(1));
            case '/models':
                return this.handleModels(parts.slice(1));
            default:
                return `[ERROR] Unknown models command: ${action}. Use /top, /free, /paid, or /models.`;
        }
    }
    static handleTop(args) {
        const filter = args[0]?.toLowerCase() || 'all';
        const limit = parseInt(args[1] || '10', 10);
        switch (filter) {
            case 'free':
                return ModelRatings.formatTopList(ModelRatings.getTopFree(limit), `🏆 ТОП-${limit} БЕСПЛАТНЫХ МОДЕЛЕЙ (по качеству)`);
            case 'paid':
                return ModelRatings.formatTopList(ModelRatings.getTopPaid(limit), `🏆 ТОП-${limit} ПЛАТНЫХ МОДЕЛЕЙ (по качеству)`);
            case 'speed':
                return ModelRatings.formatTopList(ModelRatings.getTopBySpeed(true, limit), `⚡ ТОП-${limit} САМЫХ БЫСТРЫХ БЕСПЛАТНЫХ`);
            case 'context':
                return ModelRatings.formatTopList(ModelRatings.getTopByContext(true, limit), `📚 ТОП-${limit} БОЛЬШЕ КОНТЕКСТА (бесплатные)`);
            case 'all':
            default:
                const freeTop = ModelRatings.getTopFree(5);
                const paidTop = ModelRatings.getTopPaid(5);
                let result = ModelRatings.formatTopList(freeTop, `💰 ТОП-5 БЕСПЛАТНЫХ (из 46)`);
                result += '\n' + ModelRatings.formatTopList(paidTop, `💳 ТОП-5 ПЛАТНЫХ (из 32)`);
                result += '\n──────────────────────────────────────────────────────────────────────────────';
                result += '\nКоманды:';
                result += '\n  /top free [N]   - Топ N бесплатных';
                result += '\n  /top paid [N]   - Топ N платных';
                result += '\n  /top speed [N]  - Самые быстрые';
                result += '\n  /top context [N] - С самым большим контекстом';
                result += '\n  /free           - Все 46 бесплатных';
                result += '\n  /paid           - Все 32 платных';
                return result;
        }
    }
    static handleFree(args) {
        const models = ModelRegistry.getFreeModels();
        const lines = [];
        lines.push('');
        lines.push('═'.repeat(78));
        lines.push(`  💰 ВСЕ БЕСПЛАТНЫЕ МОДЕЛИ (${models.length} моделей)`);
        lines.push('═'.repeat(78));
        lines.push('');
        for (let i = 0; i < models.length; i++) {
            const m = models[i];
            const rating = ModelRatings.computeRating(m);
            lines.push(`  ${(i + 1).toString().padStart(2)}. ${m.name}`);
            lines.push(`      ID: ${m.id}`);
            lines.push(`      Provider: ${m.provider} | Context: ${m.contextWindow.toLocaleString()} tokens`);
            lines.push(`      Free: ${m.pricing.freeTierDetails.substring(0, 60)}`);
            lines.push(`      Rating: Q${rating.quality} | S${rating.speed} | C${rating.context} | $${rating.cost} | Composite: ${rating.composite}/100`);
            lines.push('');
        }
        return lines.join('\n');
    }
    static handlePaid(args) {
        const models = ModelRegistry.getPaidOnlyModels();
        const lines = [];
        lines.push('');
        lines.push('═'.repeat(78));
        lines.push(`  💳 ВСЕ ПЛАТНЫЕ МОДЕЛИ (${models.length} моделей)`);
        lines.push('═'.repeat(78));
        lines.push('');
        for (let i = 0; i < models.length; i++) {
            const m = models[i];
            const rating = ModelRatings.computeRating(m);
            lines.push(`  ${(i + 1).toString().padStart(2)}. ${m.name}`);
            lines.push(`      ID: ${m.id}`);
            lines.push(`      Provider: ${m.provider} | Context: ${m.contextWindow.toLocaleString()} tokens`);
            lines.push(`      Pricing: In: ${m.pricing.inputPer1MTokensUSD} | Out: ${m.pricing.outputPer1MTokensUSD}`);
            lines.push(`      Rating: Q${rating.quality} | S${rating.speed} | C${rating.context} | $${rating.cost} | Composite: ${rating.composite}/100`);
            lines.push('');
        }
        return lines.join('\n');
    }
    static handleModels(args) {
        const filter = args[0]?.toLowerCase() || 'summary';
        const lines = [];
        if (filter === 'summary') {
            const free = ModelRegistry.getFreeModels();
            const paid = ModelRegistry.getPaidOnlyModels();
            lines.push('');
            lines.push('═'.repeat(78));
            lines.push('  📊 СВОДКА ПО МОДЕЛЯМ');
            lines.push('═'.repeat(78));
            lines.push('');
            lines.push(`  💰 Бесплатных: ${free.length} моделей (${((free.length / (free.length + paid.length)) * 100).toFixed(0)}%)`);
            lines.push(`  💳 Платных:    ${paid.length} моделей (${((paid.length / (free.length + paid.length)) * 100).toFixed(0)}%)`);
            lines.push(`  📦 Всего:      ${free.length + paid.length} моделей`);
            lines.push('');
            lines.push('  Команды:');
            lines.push('    /top             - Топ-5 free + топ-5 paid');
            lines.push('    /top free [N]    - Топ-N бесплатных');
            lines.push('    /top paid [N]    - Топ-N платных');
            lines.push('    /top speed [N]   - Самые быстрые');
            lines.push('    /top context [N] - Большой контекст');
            lines.push('    /free            - Все 46 бесплатных');
            lines.push('    /paid            - Все 32 платных');
            lines.push('');
        }
        return lines.join('\n');
    }
}
