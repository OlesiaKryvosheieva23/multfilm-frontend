import {describe, it, expect, vi, beforeEach} from "vitest";
import {flushPromises, shallowMount} from "@vue/test-utils";
import axios from "axios";
import  MyToWatchFilm from "../MyToWatchFilms.vue";
import SearchFilm from "@/components/SearchFilm.vue";

vi.mock("axios");

describe("Watchlist",()=>{

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads watchlist",async()=>{

    vi.mocked(axios, true).get.mockResolvedValue({

      data:[
        {
          movieID:1,
          title:"Batman",
          id:550,
          owner:"user",
          toWatch:true,
          seen:false
        }
      ]
    });

    const wrapper=shallowMount(MyToWatchFilm);

    await flushPromises();

    expect(wrapper.text()).toContain("Batman");

  });

  it("marks a watchlist movie as seen", async () => {

    vi.mocked(axios, true).get.mockResolvedValue({
      data: [
        {
          movieID: 1,
          id: 1,
          title: "Avatar",
          owner: "user",
          toWatch: true,
          seen: false
        }
      ]
    });

    vi.mocked(axios, true).put.mockResolvedValue({
      data: {
        movieID: 1,
        id: 1,
        seen: true
      }
    });

    const wrapper = shallowMount(MyToWatchFilm);

    await flushPromises();

    const seenButton = wrapper.find(".seen-button");

    await seenButton.trigger("click");

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining("/toggle-seen")
    );
  });

  it("removes a movie from the watchlist", async () => {

    vi.mocked(axios, true).get.mockResolvedValue({
      data: [
        {
          movieID: 1,
          id: 1,
          title: "Avatar",
          seen: false,
          toWatch: true
        }
      ]
    });

    vi.mocked(axios, true).put.mockResolvedValue({
      data: {}
    });

    const wrapper = shallowMount(MyToWatchFilm, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    });

    await flushPromises();

    const buttons = wrapper.findAll(".btn-secondary");


    await buttons[1]!.trigger("click");

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining("/remove-watchlist")
    );
  });

  it("filters movies by seen status", async () => {

    vi.mocked(axios, true).get.mockResolvedValue({
      data: [
        {
          movieID: 1,
          id: 1,
          title: "Avatar",
          seen: true,
          toWatch: true
        },
        {
          movieID: 2,
          id: 2,
          title: "Batman",
          seen: false,
          toWatch: true
        }
      ]
    });

    const wrapper = shallowMount(MyToWatchFilm, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    });

    await flushPromises();


    const buttons = wrapper.findAll("button");



    const seenButton = buttons.find(button => button.text() === "Gesehen");

    expect(seenButton).toBeDefined();

    await seenButton!.trigger("click");

    expect(wrapper.text()).toContain("Avatar");
    expect(wrapper.text()).not.toContain("Batman");
  });

  it("filters watchlist by search text", async () => {

    vi.mocked(axios, true).get.mockResolvedValue({
      data: [
        {
          movieID: 1,
          id: 1,
          title: "Avatar",
          seen: false,
          toWatch: true
        },
        {
          movieID: 2,
          id: 2,
          title: "Batman",
          seen: false,
          toWatch: true
        }
      ]
    });

    const wrapper = shallowMount(MyToWatchFilm, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    });

    await flushPromises();

    const input = wrapper.find("#watchlist-search");

    expect(input.exists()).toBe(true);

    await input.setValue("Bat");

    await flushPromises();

    expect(wrapper.text()).toContain("Batman");
    expect(wrapper.text()).not.toContain("Avatar");

  });

});
