<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import TermsContent from "../../lib/views/terms/Content.svelte";
</script>

<Meta title="Pages/Terms" component={TermsContent} />

<Template let:args>
  <TermsContent />
</Template>

<Story name="Onboarding Terms" />
