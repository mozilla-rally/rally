<script>
  let clazz;
  export { clazz as class };
</script>

<ol class={`container ${clazz || ""}`}>
  <li>
    <h1>Read the study card</h1>
    <p>
      The card discloses the data we collect from you, who has access to the
      data, and how it will be used. 
    </p>
  </li>

  <li>
    <h1>Join the Study</h1>
    <p>
      Click the <b>Join Study</b> button. We'll ask you to confirm in a pop-up dialog
      by clicking the <b>Add Study Extension</b> button. This will open up the Chrome
      Web Store.
    </p>
  </li>

  <li>
    <h1>Add study extension</h1>
    <p>
      In the Chrome Web Store, click on the <b>Add to Chrome</b> button. This will
      add the study's extension to your browser. You are now participating!
    </p>
  </li>
</ol>

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 20px;
    list-style-type: none;

    background: #ffffff;

    border: 1px solid #cdcdd4;
    box-sizing: border-box;
    border-radius: 4px;
  }

  .container li {
    counter-increment: step-counter;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-basis: 0;
    align-self: stretch;
    margin: 4px 6px;
  }

  .container li:not(:first-child) {
    border-left: 1px solid #c4c4c4;
    padding-left: 12px;
  }

  .container li::before {
    content: counter(step-counter);
    background-color: #312a64;
    color: white;
    width: 28.65px;
    height: 28.65px;
    border-radius: 50%;
    display: flex;
    align-self: center;
    justify-content: center;

    font-family: "Zilla Slab";
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;

    margin-bottom: 12px;
  }

  .container h1 {
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #2b2156;
    margin-bottom: 4px;
  }

  .container li p {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: #5e5e72;
  }

  @media (max-width: 480px) {
    .container {
      flex-direction: column;
      padding: 12px;
    }

    .container li {
      border: none !important;
      padding-left: 0px !important;
    }

    .container li::before {
      align-self: unset;
      position: absolute;
    }

    .container h1,
    .container p {
      text-align: unset !important;
      margin-left: 36.65px;
    }
  }
</style>
