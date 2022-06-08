<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Button from "../../lib/components/Button.svelte";
  import "./css/RallyCard.css";
</script>

<Meta
  title="Components/Button"
  component={Button}
  argTypes={{
    customControl: { control: "boolean" },
    textColor: { control: "text" },
    background: { control: "text" },
    borderColor: { control: "text" },
    dark: { control: "boolean" },
    icon: { control: "boolean" },
    product: { control: "boolean" },
    leave: { control: "boolean" },
    neutral: { control: "boolean" },
    size: { control: "text" },
    secondary: { control: "boolean" },
    text: { control: "boolean" },
    label: { control: "text" },
  }}
/>

<!-- 👇 We create a “template” of how args map to rendering -->
<Template let:args>
  <div class="btn-container">
    <Button {...args}>{args.label}</Button>
  </div>
</Template>

<!-- 👇 Each story then reuses that template -->
<Story
  name="Create"
  args={{
    label: "Create Account",
    size: "lg",
  }}
/>

<Story
  name="SignIn"
  args={{
    label: "Sign In",
    size: "lg",
    neutral: "true",
    textColor: "#000000",
    background: "#ffffff",
    borderColor: "transparent",
    customControl: true,
  }}
/>

<style>
  .btn-container {
    display: flex;
    justify-content: center; 
  }
</style>
