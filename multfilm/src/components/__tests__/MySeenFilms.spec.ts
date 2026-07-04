import {describe, it, expect, vi, beforeEach} from "vitest";
import { flushPromises, shallowMount} from "@vue/test-utils";
import axios from "axios";
import MySeenFilms from "../MySeenFilms.vue";

vi.mock("axios");

describe("Seen movies",()=>{

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads seen movies",async()=>{

    vi.mocked(axios, true).get.mockResolvedValueOnce({

      data:[
        {
          movieID:1,
          title:"Interstellar",
          seen:true,
          personalRating:5,
          commentText:"",
          id:1
        }
      ]
    });

    const wrapper = shallowMount(MySeenFilms);

    await flushPromises();

    expect(wrapper.text()).toContain("Interstellar");

  });

  it("saves rating", async () => {

    vi.mocked(axios, true).get.mockResolvedValueOnce({
      data: [
        {
          movieID: 1,
          id: 1,
          title: "Boring Movie",
          owner: "Max",
          seen: true,
          toWatch: false,
          commentText: "",
          personalRating: 0,
          overview: "",
          posterUrl: "poster.jpg",
          releaseDate: "2023-01-01",
          director: "Patrick Neuer",
          voteAverage: 8.5
        }
      ]
    });

    vi.mocked(axios, true).put.mockResolvedValue({
      data: {
        personalRating: 4
      }
    });

    const wrapper = shallowMount(MySeenFilms);

    await flushPromises();

    const buttons = wrapper.findAll(".star-button");

    expect(buttons).toHaveLength(5);

    const fourthStar = buttons[3];

    expect(fourthStar).toBeDefined();

    await fourthStar!.trigger("click");

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining("/rating"),
      expect.objectContaining({
        personalRating: 4
      })
    );
  });

  it("saves comment",async()=>{

    vi.mocked(axios, true).get.mockResolvedValueOnce({

      data:[
        {
          movieID:1,
          title:"Film",
          commentText:"",
          personalRating:0
        }
      ]
    });

    vi.mocked(axios, true).put.mockResolvedValue({

      data:{
        commentText:"Super Film"
      }
    });

    const wrapper=shallowMount(MySeenFilms);

    await flushPromises();

    await wrapper.find("textarea").setValue("Super Film");

    await wrapper.find(".btn-secondary").trigger("click");

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining("/comment"),
      expect.objectContaining({
        commentText: "Super Film"
      })
    );

  });

  it("removes a movie from the seen list", async () => {

    vi.mocked(axios, true).get.mockResolvedValue({
      data: [
        {
          movieID: 1,
          id: 1,
          title: "Interstellar",
          owner: "user",
          seen: true,
          toWatch: false,
          personalRating: 5,
          commentText: ""
        }
      ]
    });

    vi.mocked(axios, true).put.mockResolvedValue({
      data: {
        movieID: 1,
        id: 1,
        seen: false
      }
    });

    const wrapper = shallowMount(MySeenFilms, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    });

    await flushPromises();

    const seenButton = wrapper.find(".seen-button");

    expect(seenButton.exists()).toBe(true);

    await seenButton.trigger("click");

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining("/toggle-seen")
    );
  });
});
