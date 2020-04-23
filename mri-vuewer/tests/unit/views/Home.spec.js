import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

describe("views/Home.vue", () => {
  it("renders elm test", () => {
    const wrapper = shallowMount(Home, {
      propsData: {}
    });
    // home class を持っている
    expect(wrapper.find(".home").exists()).toBeTruthy();
  });
});
