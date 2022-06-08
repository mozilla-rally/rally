<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { createEventDispatcher } from "svelte";
  import Arrow from "../components/icons/CaretRight.svelte";

  const dispatch = createEventDispatcher();

  export let width;
  export let fontSize;
  export let clazz;
  export let listArr;
  export let isGoogleOnlyAccount;

  let ariaExpanded = false;
  let ariaHidden = true;
  let arrowCollapsed = false;
  let hide = "display:none;";
  let show = "display:block;";

  function toVariable(key, value) {
    return value ? `${key}: ${value};` : undefined;
  }

  function addStyleVariables({ width, fontSize }) {
    const values = [
      toVariable("--width", width),
      toVariable("--fontSize", fontSize),
    ].filter((d) => d !== undefined);
    if (values.length === 0) return undefined;
    return values.join("; ");
  }

  const handleSelect = (type) => {
    dispatch("type", {
      text: type,
    });

    handleHighlight(type);
  };

  const handleHighlight = (type) => {
    listArr.forEach((siderItem) => {
      siderItem.highlight = siderItem.type === type;
      //handle the sublists' highlight
      (siderItem.sublistArr || []).forEach((sublistItem) => {
        sublistItem.highlight = sublistItem.type === type;
      });
    });
    listArr = listArr;
  };

  const rotateArrow = () => (arrowCollapsed = !arrowCollapsed);

  const toggleNav = () => {
    ariaExpanded = !ariaExpanded;
    ariaHidden = !ariaHidden;
    rotateArrow();
  };

  $: styles = addStyleVariables({
    width,
    fontSize,
  });
  $: classSet = ["sidenav-body", clazz].filter((t) => t).join(" ");

  const key = `sidenav-${
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  }`;
</script>

<div id={key} class="sidenav" style={styles}>
  <div class={classSet}>
    <ul class="sidenav__list">
      {#each listArr as item}
        <li
          class={`sidenav__list__item sidenav__list__item--${item.type} ${
            item.highlight === true
              ? "list-item--active"
              : "list-item--inactive"
          } d-flex align-item-center`}
          on:click={() => {
            handleSelect(item.type);
          }}
        >
          {#if item.sublistArr}
            <div class="sider-sublist p-0 d-flex align-items-center">
              <img src={item.icon} alt="sider-sublist__icon" />
              <div class="sider-sublist__text list-text">{item.title}</div>
              <button
                on:click={toggleNav}
                class={`sider-sublist__arrow sider-sublist__arrow--${
                  arrowCollapsed === true ? "collapsed" : "default"
                }`}
                data-expands="sublist-nav"
                data-expands-height
                aria-expanded={ariaExpanded}
                type="button"
              >
                <Arrow />
              </button>
            </div>
          {:else}
            <img src={item.icon} alt="sider icon" />
            {#if item.href}
              <a href={item.href} class="list-text">{item.title}</a>
            {:else}
              <div class="list-text">{item.title}</div>
            {/if}
          {/if}
        </li>
      {/each}
    </ul>

    <ul
      id="sublist-nav"
      aria-hidden={ariaHidden}
      class="sublist-menu overflow-hidden"
    >
      {#each listArr as item}
        {#if item.sublistArr}
          {#each item.sublistArr as subItem}
            <li
              class={`sublist-menu__item sidenav__list__item sidenav__list__item--${
                subItem.type
              }  ${
                subItem.highlight === true
                  ? "list-item--active"
                  : "list-item--inactive"
              } sublist__item--${subItem.type}`}
              on:click={() => {
                handleSelect(subItem.type);
              }}
              style={isGoogleOnlyAccount && subItem.type !== "delete" ? hide : show}
            >
              <div class="sublist-menu__text">
                {subItem.title}
              </div>
            </li>
          {/each}
        {/if}
      {/each}
    </ul>
  </div>
</div>

<style>
  .sidenav {
    max-width: var(--width);
  }

  .sidenav__list {
    font-size: var(--fontSize);
  }

  .sidenav a:hover {
    text-decoration: none;
    color: var(--color-marketing-gray-99);
  }

  .highlight {
    background-color: var(--color-light-gray-20);
  }

  .sider-sublist__arrow {
    transition: all 0.4s ease;
  }

  .sider-sublist__arrow--collapsed {
    transform: rotateZ(90deg);
  }

  .sider-sublist__arrow--default {
    transform: rotateZ(0deg);
  }

  a {
    text-decoration: none;
    color: var(--color-marketing-gray-99);
  }
</style>
