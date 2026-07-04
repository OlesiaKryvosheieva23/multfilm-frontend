import { describe, it, expect, vi, beforeEach } from "vitest";

import axios from "axios";
import SearchFilm from "../SearchFilm.vue";
import { shallowMount, flushPromises } from "@vue/test-utils";




vi.mock("axios");

describe("SearchFilm", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads trending movies", async () => {

    vi.mocked(axios, true).get
      .mockResolvedValueOnce({
        data: []
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            title: "Avatar",
            overview: "Film",
            poster_path: "/poster.jpg",
            release_date: "2022",
            vote_average: 8
          }
        ]
      });

    const wrapper = shallowMount(SearchFilm);

    await flushPromises();

    expect(wrapper.text()).toContain("Avatar");
  });

  it("adds a movie to the watchlist", async () => {
    vi.mocked(axios, true).get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            title: "Avatar",
            overview: "Film",
            poster_path: "/poster.jpg",
            release_date: "2022",
            vote_average: 8
          }
        ]
      });

    vi.mocked(axios, true).post.mockResolvedValue({
      data: {
        movieID: 1,
        id: 1,
        title: "Avatar",
        owner: "user",
        toWatch: true,
        seen: false
      }
    });

    const wrapper = shallowMount(SearchFilm, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    });

    await flushPromises();

    const button = wrapper.find("button");

    await button.trigger("click");

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/movie-entries"),
      expect.objectContaining({
        title: "Avatar",
        toWatch: true
      })
    );
  });


});
