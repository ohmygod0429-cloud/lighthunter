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
- Public section reads require explicit publication and nonempty content; secret-validated saves publish complete settings and unpublish cleared settings so drafts never enter visitor data or signed-file allowlists.
- Reuse the external-links editor for all video slots and individual dimension panels so limits, validation, and empty-state behavior stay consistent.
- Attach the shared section-media editor to the shared external-links surface; store media settings separately so existing links and video settings remain unchanged.
- Keep section uploads private with secret-validated signed uploads; issue public download capabilities server-side only for paths authorized by publicly readable saved section settings, never caller-selected paths.
- Prepare application photos server-side using validated image type/size and generated paths with non-overwriting signed upload capabilities; this preserves public applications without granting anonymous bucket writes.
- Validate application submissions against existing required fields, formats and commitments both in the shared schema and insert policy; this rejects malformed direct writes without restricting legitimate public applicants.
- Persist original VideoSlot URLs in reserved `legacy-<slotId>` section_media rows through the existing secret-validated writer; this makes videos visible across browsers without replacing introduction videos or attachments.
- Gatherings (dimension 06) data lives in server-only tables accessed through passcode-checked server functions; performer photos reuse the private teacher-photos bucket.
