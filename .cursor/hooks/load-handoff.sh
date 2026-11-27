#!/bin/bash
# sessionStart hook: adds the last session hand-off (.cursor/handoff.md) to a new chat's context.
# Fails open: any problem produces an empty response and the chat starts normally.

cat >/dev/null

handoff=".cursor/handoff.md"

if [ ! -f "$handoff" ] || ! command -v jq >/dev/null 2>&1; then
	echo '{}'
	exit 0
fi

updated=$(date -r "$handoff" '+%Y-%m-%d %H:%M')
content=$(head -c 12000 "$handoff")

jq -n --arg updated "$updated" --arg content "$content" '{
	additional_context: (
		"Hand-off notes from a previous session (file last written " + $updated + "). " +
		"They may be out of date: verify branch, git status and PR state before relying on them, " +
		"and run the session-resume workflow if the user asks to continue.\n\n" + $content
	)
}'
