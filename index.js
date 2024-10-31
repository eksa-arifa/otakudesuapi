const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.type("json");

  const keluaran = {
    success: true,
    author: "Eksa Dev",
    sumber: "https://otakudesu.ltd/",
    pesan:
      "Kami mohon izin kepada pihak otakudesu untuk mengambil data dari web kalian",
    data: {
      Ambil_anime_terbaru: "/terbaru",
      Ambil_detail_anime: "/detail/:endpoint",
      Ambil_stream_anime: "/stream/:endpoint",
      Ambil_search_anime: "/search/:namaanime",
      Ambil_all_kategori_list: "/genrelist",
      Ambil_data_genre: "/genres/:endpoint",
    },
  };
  res.send(keluaran);
});

app.get("/terbaru", (req, res) => {
  res.type("json");

  getDataAnime().then((result) => {
    res.send(result);
  });
});

app.get("/anime/:namanime", (req, res) => {
  res.type('json')

  const url = req.params.namanime;

  getDetailAnime(url).then((result) => {
    res.send(result);
  });
});

app.get("/stream/:namanime", (req, res) => {
  const url = req.params.namanime;

  streamNime(url).then((result) => {
    res.send(result);
  });
});

app.get("/search/:nama", (req, res) => {
  const url = req.params.nama;

  searchNime(url).then((result) => {
    res.send(result);
  });
});

app.get("/genrelist", (req, res) => {
  kategoriList().then((response) => {
    res.send(response);
  });
});

app.get("/genres/:nama/page/:hal", (req, res) => {
  const nama = req.params.nama;
  const hal = req.params.hal;

  genres(nama, hal).then((response) => {
    res.send(response);
  });
});

async function getDataAnime() {
  let { data } = await axios.get("https://otakudesu.cloud");

  const $ = cheerio.load(data);

  let arr = [];

  const venz = $(".venz")
    .first()
    .find(".detpost")
    .each((index, element) => {
      const jj = $(element).find(".jdlflm").text();
      const hariUpload = $(element).find(".epztipe").text();
      const episodeKe = $(element).find(".epz").text();
      const tanggalUp = $(element).find(".newnime").text();
      const thumbnail = $(element).find("img").attr("src");
      let endpoint = $(element).find("a").attr("href");

      endpoint = endpoint.split("/")[4];

      arr.push({
        id: index + 1,
        judul: jj,
        hariUp: hariUpload,
        episodeBaru: episodeKe,
        tanggalUpload: tanggalUp,
        thumb: thumbnail,
        endpoint: endpoint,
      });
    });

  let objek = {
    success: true,
    author: "Eksa Dev",
    sumber: "https://otakudesu.ltd/",
    pesan:
      "Kami mohon izin kepada pihak otakudesu untuk mengambil data dari web kalian",
    data: {
      arr,
    },
  };

  return objek;
}

async function getDetailAnime(anime) {

  const url = `https://otakudesu.cloud/anime/${anime}/`

  let { data } = await axios.get(url);

  // const $ = cheerio.load(data);

  
  let arr = [];
  // let arr2 = [];

  // const fotonime = $(".venser").find(".fotoanime img").attr("src");
  // const judul = $(".venser").find(".infozingle p").first().text();
  // const skor = $(".venser").find(".infozingle p:nth-child(3)").text();
  // const produser = $(".venser").find(".infozingle p:nth-child(4)").text();
  // const status = $(".venser").find(".infozingle p:nth-child(6)").text();
  // const totaleps = $(".venser").find(".infozingle p:nth-child(7)").text();
  // const studio = $(".venser").find(".infozingle p:nth-child(10)").text();
  // const genre = $(".venser").find(".infozingle p:nth-child(11)").text();
  // const sinopsis = $(".venser").find(".sinopc").text();

  // $(".venser .episodelist ul li").each((index, element) => {
  //   const episod = $(element).find("a").text();
  //   let endpoint = $(element).find("a").attr("href");

  //   endpoint = endpoint.split("/")[4];

  //   arr2.push({
  //     id: index + 1,
  //     title: episod,
  //     endpoint: endpoint,
  //   });
  // });

  // arr.push({
  //   fotonime: fotonime,
  //   judul: judul,
  //   skor: skor,
  //   produser: produser,
  //   status: status,
  //   totaleps: totaleps,
  //   studio: studio,
  //   genre: genre,
  //   sinopsis: sinopsis,
  //   // episodelist: arr2,
  // });

  let objek = {
    success: true,
    author: "Eksa Dev",
    sumber: "https://otakudesu.ltd/",
    pesan:
      "Kami mohon izin kepada pihak otakudesu untuk mengambil data dari web kalian",
    data: {
      arr,
    },
  };

  return objek;
}

async function streamNime(url) {
  const { data } = await axios.get("https://otakudesu.cloud/episode/" + url);

  const $ = cheerio.load(data);

  const arr = [];
  const download = [];

  const jdlflm = $(".venser").find(".posttl").text();
  const iframe = $(".responsive-embed-stream iframe").attr("src");

  const el = $(".venser").find(".download ul").html();

  download.push(el);

  arr.push({
    judul: jdlflm,
    iframe: iframe,
    link: download,
  });

  let objek = {
    success: true,
    author: "Eksa Dev",
    sumber: "https://otakudesu.ltd/",
    pesan:
      "Kami mohon izin kepada pihak otakudesu untuk mengambil data dari web kalian",
    data: {
      arr,
    },
  };

  return objek;
}

const searchNime = async (url) => {
  const { data } = await axios.get(
    `https://otakudesu.cloud/?s=${url}&post_type=anime`
  );

  const $ = cheerio.load(data);

  const arr = [];

  $(".chivsrc li").each((index, element) => {
    const thumb = $(element).find("img").attr("src");
    const nama = $(element).find("a").first().text();
    const genres = $(element).find(".set").first().text();
    const status = $(element).find("div:nth-child(4)").text();
    const rating = $(element).find("div:nth-child(5)").text();
    let endpoint = $(element).find("a").attr("href");

    endpoint = endpoint.split("/")[4];

    arr.push({
      id: index + 1,
      thumb: thumb,
      nama: nama,
      genres: genres,
      status: status,
      rating: rating,
      endpoint: endpoint,
    });
  });

  let objek = {
    success: true,
    author: "Eksa Dev",
    sumber: "https://otakudesu.ltd/",
    pesan:
      "Kami mohon izin kepada pihak otakudesu untuk mengambil data dari web kalian",
    data: {
      arr,
    },
  };

  return objek;
};

const kategoriList = async () => {
  const { data } = await axios.get(`https://otakudesu.cloud/genre-list/`);

  const $ = cheerio.load(data);

  const arr = [];

  $(".genres li a").each((index, element) => {
    const nama = $(element).text();
    const endpoint = $(element).attr("href").split("/")[2];

    arr.push({
      id: index + 1,
      nama: nama,
      endpoint: endpoint,
    });
  });

  let objek = {
    success: true,
    author: "Eksa Dev",
    sumber: "https://otakudesu.ltd/",
    pesan:
      "Kami mohon izin kepada pihak otakudesu untuk mengambil data dari web kalian",
    data: {
      arr,
    },
  };

  return objek;
};

const genres = async (nama, hal) => {
  const { data } = await axios.get(`https://otakudesu.cloud/genres/${nama}/page/${hal}`);

  const $ = cheerio.load(data);
  const arr = [];

  $(".col-anime-con").each((index, element) => {
    const nama = $(element).find(".col-anime .col-anime-title").text();
    const studio = $(element).find(".col-anime .col-anime-studio").text();
    const eps = $(element).find(".col-anime .col-anime-eps").text();
    const rating = $(element).find(".col-anime .col-anime-rating").text();
    const genre = $(element).find(".col-anime .col-anime-genre").text();
    const synopsis = $(element).find(".col-anime .col-synopsis").text();
    const thumb = $(element)
      .find(".col-anime .col-anime-cover img")
      .attr("src");
    const endpoint = $(element)
      .find(".col-anime .col-anime-title a")
      .attr("href")
      .split("/")[4];

    arr.push({
      nama: nama,
      thumb: thumb,
      studio: studio,
      eps: eps,
      rating: rating,
      genre: genre,
      synopsis: synopsis,
      endpoint: endpoint,
    });
  });

  let objek = {
    success: true,
    author: "Eksa Dev",
    sumber: "https://otakudesu.ltd/",
    pesan:
      "Kami mohon izin kepada pihak otakudesu untuk mengambil data dari web kalian",
    data: {
      arr,
    },
  };

  return objek;
};

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
