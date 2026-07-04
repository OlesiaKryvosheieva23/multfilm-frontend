import { describe, it, expect, vi, beforeEach } from "vitest";

import axios from "axios";
import SearchFilm from "../SearchFilm.vue";
import { mount, flushPromises } from "@vue/test-utils";



vi.mock("axios");

describe("SearchFilm", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads trending movies", async () => {

    (axios.get as any)
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

    const wrapper = mount(SearchFilm);

    await flushPromises();

    expect(wrapper.text()).toContain("Avatar");
  });

});
