describe("hello", () => {
  it("world", () => {
    const browser = (
      global as unknown as Record<string, Record<string, string>>
    ).browser;
    console.log(JSON.stringify(browser));
  });
});
