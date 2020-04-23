import { mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import MAppBar from "@/components/MAppBar.vue";

describe("components/MAppBar.vue", () => {
  let vuetify;
  beforeEach(() => {
    Vue.use(Vuetify);
    vuetify = new Vuetify();
  });

  it("renders elm test", () => {
    const wrapper = mount(MAppBar, {
      vuetify,
      propsData: {
        version: "2.0",
        name: "MRI Vuewer"
      }
    });
    expect(wrapper.find(".v-app-bar").exists()).toBeTruthy();

    // タイトルの確認
    const title = wrapper.find(".v-toolbar__title");
    expect(title.exists()).toBeTruthy();
    expect(title.text()).toBe("MRI Vuewer ver. 2.0");
  });
});
