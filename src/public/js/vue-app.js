// vue-app.js
const vueApp = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        //DOMAIN: 'https://comic-sv1.onrender.com/',
        DOMAIN: 'http://localhost:8888/',
        domain_image: 'https://phimimg.com',
        domain_cdn_read: '',
        middle_domain: '/uploads/comics/',

        per_page: 10,
        total_page: 100,
        total_items: 0,
        page: 1,

        listMovies: [],
        image_movies: [],
        movieSlug: '',
        episodeSlug: '',
        episodeNumber: 0,

        detailMovie: [],
        listEpisodes: [],

    },
    methods: {
        async fetchListMovies() {
            try {
                const response = await axios.post('/api', {
                    page: this.page
                });

                if (response.data.success) {
                    console.log(response.data)

                    this.listMovies = response.data.data.items;
                    this.image_movies = response.data.data.seoOnPage.og_image;
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
                alert('Có lỗi xảy ra khi đăng nhập');
            }

        },
        async fetchDetailMovies() {
            try {
                const response = await axios.post('/detail-movie/api', {
                    slug: this.movieSlug
                });

                if (response.data.success) {
                    console.log(response.data)

                    this.detailMovie = response.data.data.movie;
                    console.log(this.detailMovie)

                    this.listEpisodes = response.data.data.episodes[0];
                    console.log(this.listEpisodes)

                    sessionStorage.setItem('detailMovie', JSON.stringify(this.detailMovie));
                    sessionStorage.setItem('listEpisodes', JSON.stringify(this.listEpisodes));
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
                alert('Có lỗi xảy ra khi đăng nhập');
            }

        },
        fetchInfomationVideo() {
            const playButton = document.getElementById("playButton");
            const video = document.querySelector("video");
            const poster = this.detailMovie.thumb_url;
            const videoSrc = this.listEpisodes.server_data[this.episodeNumber-1].link_m3u8;
            console.log(poster);
            video.setAttribute('poster', poster);
            
            playButton.addEventListener("click", function () {
                // Ẩn overlay khi nút được nhấn
                document.querySelector(".video-overlay").classList.add("hidden");
                
                // Kiểm tra nếu HLS được hỗ trợ
                if (Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(videoSrc);
                    hls.attachMedia(video);
                    video.volume = 0.1;
                    hls.on(Hls.Events.MANIFEST_PARSED, function () {
                        video.play();
                    });
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = videoSrc;
                    video.play();
                } else {
                    alert("Trình duyệt không hỗ trợ phát video này.");
                }
            });

            const toggleLightsButton = document.getElementById("toggleLights");
            const dimOverlay = document.querySelector(".dim-overlay");

            toggleLightsButton.addEventListener("click", function () {
                // Toggle lớp phủ
                dimOverlay.classList.toggle("active");

                // Đổi nhãn nút khi bật/tắt đèn
                if (dimOverlay.classList.contains("active")) {
                    toggleLightsButton.innerHTML = `<i class="bi bi-brightness-high-fill" ></i > Bật đèn`;
                } else {
                    toggleLightsButton.innerHTML = `<i class="bi bi-brightness-high-fill" ></i > Tắt đèn`;
                }
            });
        },
        fetchDataStorage() {
            console.log('get');
            this.detailMovie = JSON.parse(sessionStorage.getItem('detailMovie'));
            this.listEpisodes = JSON.parse(sessionStorage.getItem('listEpisodes'));
            // this.comic_detail = JSON.parse(sessionStorage.getItem('comic_detail'));
            // this.isLogin = JSON.parse(sessionStorage.getItem('isLogin'));
            // this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
            // this.dataLevel = JSON.parse(sessionStorage.getItem('dataLevel'));
            // console.log(this.dataUser)
            // this.comicNameSearch = JSON.parse(sessionStorage.getItem('comicNameSearch'));
            // // this.comicName = JSON.parse(sessionStorage.getItem('comicName'));
            // this.comicNumber = JSON.parse(sessionStorage.getItem('comicNumber'));
            // this.dataComicFavor = JSON.parse(sessionStorage.getItem('dataComicFavor'));
            // console.log(this.dataComicFavor)
            // this.comics_type = JSON.parse(localStorage.getItem('comics_type'));
            // if (!this.comics_type) {
            //     this.fetchTypes();
            // }
        }
    },
    computed: {
        visiblePages() {
            console.log(this.page)
            // Tính toán phạm vi hiển thị từ page đến page + 15
            const start = this.page;
            const end = Math.min(this.page + 7, this.total_page); // Không vượt quá total_page
            console.log(Array.from({ length: end - start + 1 }, (_, i) => start + i))
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        },
    },
    mounted() {
        this.fetchDataStorage();

        // Fetch danh sách truyện khi trang được tải
        if (window.location.pathname === '/') {
            const urlParams = new URLSearchParams(window.location.search);
            const page = parseInt(urlParams.get('page'), 10);
            if (page) {
                this.page = page;
            }
            this.fetchListMovies();
        }

        if (window.location.pathname === '/detail-movie') {
            const urlParams = new URLSearchParams(window.location.search);
            const movieSlug = urlParams.get('id');
            if (movieSlug) {
                console.log(movieSlug)
                this.movieSlug = movieSlug;
                this.fetchDetailMovies();
            }
        }

        if (window.location.pathname === '/watch-movie') {
            const urlParams = new URLSearchParams(window.location.search);
            const number = urlParams.get('id');
            const num = number.split('-');
            const episodeNumber = parseInt(num[1], 10);
            if (episodeNumber) {
                this.episodeNumber = episodeNumber;
                console.log(this.episodeNumber);
                this.fetchInfomationVideo()
            }
        }

        // if (window.location.pathname === '/search') {
        //     const urlParams = new URLSearchParams(window.location.search);
        //     const comicNameSearch = urlParams.get('keyword');
        //     this.page = parseInt(urlParams.get('page'), 10)
        //     if (comicNameSearch) {
        //         console.log(comicNameSearch)
        //         console.log(this.page)
        //         this.comicNameSearch = comicNameSearch;
        //         this.fetchComicSearchs(comicNameSearch);
        //     }
        // }

        // if (window.location.pathname === '/type') {
        //     const urlParams = new URLSearchParams(window.location.search);
        //     const comicNameType = urlParams.get('name');
        //     this.page = parseInt(urlParams.get('page'), 10)
        //     if (comicNameType) {
        //         this.comicNameType = comicNameType;
        //         console.log(comicNameType)
        //         console.log(this.page)
        //         this.fetchComicTypes(comicNameType);
        //     }
        // }

    },
});
