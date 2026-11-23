<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Store section external links in the shared Cloud table, with public read-only access and server-side secret validation for writes; browser admin mode only controls editor visibility.
- Reuse the external-links editor for all video slots and individual dimension panels so limits, validation, and empty-state behavior stay consistent.
- Attach the shared section-media editor to the shared external-links surface; store media settings separately so existing links and video settings remain unchanged.
- Keep section uploads in private storage with secret-validated signed uploads and public read policies limited to saved section paths; this prevents anonymous writes and exposure of unpublished uploads.
- Persist original VideoSlot URLs in reserved `legacy-<slotId>` section_media rows through the existing secret-validated writer; this makes videos visible across browsers without replacing introduction videos or attachments.
