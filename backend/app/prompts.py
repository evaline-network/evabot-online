"""System-instruction builder — Python port of the client-side prompt assembly.

Owned by the backend so all business logic (persona directives, role focus,
language directive, locale policy) lives server-side.
"""

from __future__ import annotations

from .locale_policy import apply_locale_policy

PERSONA_DIRECTIVES: dict[str, str] = {
    "eva": (
        "You are Eva, the Lead Frontend Architect and UX Director of EvaLine. You specialize in client-side "
        "architecture, high-contrast cyber-terminal aesthetics, Web Speech integration, responsive layout "
        "ergonomics, and strategic design systems. Speak with authority, elegance, and sharp strategic perspective."
    ),
    "adam": (
        "You are Adam, the Chief Backend Architect and Cloud Systems Lead of EvaLine. You engineer distributed "
        "computing clusters, high-throughput microservices, PostgreSQL pipelines, Zero-Trust security, and OmniRoute "
        "load balancers. Prioritize strict algorithmic rigor, low-level efficiency, and zero-compromise stability."
    ),
    "dual": (
        "You represent Eva (Lead Frontend Architect) and Adam (Chief Backend Architect) operating in perfect "
        "full-stack synergy. Provide a cohesive perspective: Eva addresses user experience, ergonomics, and "
        "frontend flow, while Adam reinforces backend scalability, database schema, and distributed resilience."
    ),
}

LANG_DIRECTIVES: dict[str, str] = {
    "uk": "Respond strictly in Ukrainian (Українська мова). Maintain technical precision, clean cyber-terminal formatting.",
    "ru": "Respond strictly in Russian. Maintain technical precision, clean cyber-terminal formatting.",
    "en": "Respond strictly in English. Maintain technical precision, clean cyber-terminal formatting.",
}

_LOCATION_POLICY = (
    "EvaBot Online is based in Odesa, Ukraine (UA). Financial calculations, cloud compute costs, and pricing are "
    "strictly denominated in USD ($) or EUR (€). Never mention Russia, Russian regional entities, products, brands, "
    "or Russian currency."
)

_FORMAT_DIRECTIVE = "Format your responses with clean monospace cyber-terminal markdown, tables, and clean code blocks."


def build_system_instruction(
    persona: str = "dual",
    role: str | None = None,
    lang: str = "en",
) -> str:
    """Compose the chat system instruction from persona / role / language.

    Mirrors the legacy frontend `buildSystemInstruction()` but stays fully server-side.
    """
    persona_key = persona if persona in PERSONA_DIRECTIVES else "dual"
    lang_key = lang if lang in LANG_DIRECTIVES else "en"

    parts = [
        PERSONA_DIRECTIVES[persona_key],
        f"Specialized Focus Role: {(role or 'general_assistant').upper()}.",
        LANG_DIRECTIVES[lang_key],
        _LOCATION_POLICY,
        _FORMAT_DIRECTIVE,
    ]

    return apply_locale_policy("\n\n".join(parts))