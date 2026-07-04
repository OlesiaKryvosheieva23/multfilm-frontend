import {describe,it,expect,vi} from "vitest";
import {mount,flushPromises} from "@vue/test-utils";
import axios from "axios";
import  MyToWatchFilm from "../MyToWatchFilms.vue";

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

});
