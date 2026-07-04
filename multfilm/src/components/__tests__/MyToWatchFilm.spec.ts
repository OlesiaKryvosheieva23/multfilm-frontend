import {describe,it,expect,vi} from "vitest";
import {mount,flushPromises} from "@vue/test-utils";
import axios from "axios";
import  MyToWatchFilm from "../MyToWatchFilms.vue";
import SearchFilm from "@/components/SearchFilm.vue";

vi.mock("axios");

describe("Watchlist",()=>{

  it("loads watchlist",async()=>{

    (axios.get as any).mockResolvedValue({

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

    const wrapper=mount(MyToWatchFilm);

    await flushPromises();

    expect(wrapper.text()).toContain("Batman");

  });

  it("marks a movie as seen", async () => {

    (axios.get as any)
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [{
          id: 1,
          title: "Avatar",
          overview: "Film",
          poster_path: "/poster.jpg",
          release_date: "2022",
          vote_average: 8
        }]
      });

    (axios.post as any).mockResolvedValue({
      data: {
        movieID: 1,
        id: 1,
        seen: true
      }
    });

    const wrapper = mount(SearchFilm, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    });

    await flushPromises();

    const button = wrapper.find(".btn.btn-secondary");

    await button.trigger("click");

    expect(axios.post).toHaveBeenCalled();
  });

  it("adds a movie to the watchlist", async () => {
    (axios.get as any)
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

    (axios.post as any).mockResolvedValue({
      data: {
        movieID: 1,
        id: 1,
        title: "Avatar",
        owner: "user",
        toWatch: true,
        seen: false
      }
    });

    const wrapper = mount(SearchFilm, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    });

    await flushPromises();

    const button = wrapper.find("button");

    await button.trigger("click");

    expect(axios.post).toHaveBeenCalled();
  });
});
