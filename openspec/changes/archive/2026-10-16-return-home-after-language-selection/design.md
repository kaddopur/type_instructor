# Design

Reuse I18nLink with the selected language and `/` destination. The existing
I18nPage route effect updates the document language and focuses Home's first
action, Start. There is no extra redirect effect or navigation state.

Selecting the current language follows the same destination as other choices.
The introduction's separate language links continue to target `/about`.
Tests return to the picker after selection when comparing localized geometry.
