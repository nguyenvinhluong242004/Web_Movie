// vue-app.js
const vueApp = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        DOMAIN: 'https://movie-sv1.onrender.com/',
        //DOMAIN: 'http://localhost:8888/',
        domain_image: 'https://phimimg.com',
        domain_cdn_read: '',
        middle_domain: '/uploads/comics/',

        per_page: 10,
        total_page: 1,
        total_items: 0,
        page: 1,

        listMovies: [],
        image_movies: [],
        movieSlug: '',
        episodeSlug: '',
        episodeNumber: 0,

        detailMovie: [],
        listEpisodes: [],
        totalItems: 0,

        movieNameSearch: '',
        otherSeasons: null,
        index_season: -1,
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
                    this.per_page = response.data.data.params.pagination.totalItemsPerPage;
                    this.total_page = response.data.data.params.pagination.totalPages;
                    this.total_items = response.data.data.params.pagination.totalItems;

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
                    console.log(this.listEpisodes.server_data.length)
                    this.totalItems = this.listEpisodes.server_data.length;

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
        async fetchDataMovieRelated() {
            const match = this.movieSlug.match(/phan-(\d+)/); // Tìm số phần từ slug

            if (!match) return; // Nếu không có "phan-" thì không cần kiểm tra

            const currentSeason = parseInt(match[1]); // Lấy số phần hiện tại
            const baseSlug = this.movieSlug.replace(/phan-\d+/, ""); // Bỏ phần số để tái sử dụng slug

            this.otherSeasons = []; // Danh sách các phần khác


            for (let i = 1; ; i++) { // Giả sử tối đa 10 phần
                if (i === currentSeason) {
                    this.otherSeasons.push({
                        name: `Phần ${i}`,
                        slug: this.movieSlug,
                    });
                    continue;
                }
                const newSlug = `${baseSlug}phan-${i}`;
                try {
                    const response = await axios.post('/detail-movie/api', {
                        slug: newSlug
                    });
                    const data = await response.data;

                    console.log(data)

                    if (data.success) {
                        this.otherSeasons.push({
                            name: `Phần ${i}`,
                            slug: newSlug,
                        });
                    } else {
                        break; // Nếu không tìm thấy phần tiếp theo thì dừng vòng lặp
                    }
                } catch (error) {
                    console.error("Lỗi khi gọi API:", error);
                    break;
                }
            }

            sessionStorage.setItem('otherSeasons', JSON.stringify(this.otherSeasons));
        },
        fetchInfomationVideo() {
            const playButton = document.getElementById("playButton");
            const video = document.querySelector("video");
            const poster = this.detailMovie.thumb_url;
            const videoSrc = this.listEpisodes.server_data[this.episodeNumber - 1].link_m3u8;
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
        async fetchSearchMovies(keyword) {
            this.movieNameSearch = keyword;
            try {
                const response = await axios.post('/search/api', {
                    keyword: this.movieNameSearch,
                    page: this.page
                });

                if (response.data.success) {
                    console.log(response.data)
                    this.listMovies = response.data.data.items;
                    this.image_movies = response.data.data.seoOnPage.og_image;
                    this.per_page = response.data.data.params.pagination.totalItemsPerPage;
                    this.total_page = response.data.data.params.pagination.totalPages;
                    this.total_items = response.data.data.params.pagination.totalItems;

                    sessionStorage.setItem('detailMovie', JSON.stringify(this.detailMovie));
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
                alert('Có lỗi xảy ra khi đăng nhập');
            }

        },
        searchMovie() {
            if ($('#txtInput').val().trim()) {
                console.log($('#txtInput').val())
                window.location.href = `/search?keyword=${encodeURIComponent($('#txtInput').val()).replace(/%20/g, "+")}&page=1`;
            } else {
                //alert("Vui lòng nhập từ khóa tìm kiếm!");
            }
        },
        searchMovieVer2() {
            if ($('#txtInput-ver2').val().trim()) {
                console.log($('#txtInput-ver2').val())
                window.location.href = `/search?keyword=${encodeURIComponent($('#txtInput-ver2').val()).replace(/%20/g, "+")}&page=1`;
            } else {
                //alert("Vui lòng nhập từ khóa tìm kiếm!");
            }
        },
        chooseMovie(idx) {
            window.location.href = `/watch-movie?slug=${this.movieSlug}&id=${this.listEpisodes.server_data[idx].slug}`;
        },
        switchMovie(val) {
            if (val === 'left' && this.episodeNumber - 1 > 0) {
                window.location.href = `/watch-movie?slug=${this.movieSlug}&id=${this.listEpisodes.server_data[this.episodeNumber - 2].slug}`;
            }
            else if (val === 'right' && this.episodeNumber < this.totalItems) {
                window.location.href = `/watch-movie?slug=${this.movieSlug}&id=${this.listEpisodes.server_data[this.episodeNumber].slug}`;
            }
        },
        fetchDataStorage() {
            console.log('get');
            this.detailMovie = JSON.parse(sessionStorage.getItem('detailMovie'));
            this.listEpisodes = JSON.parse(sessionStorage.getItem('listEpisodes'));
            this.otherSeasons = JSON.parse(sessionStorage.getItem('otherSeasons'));
            this.totalItems = this.listEpisodes.server_data.length;
            // this.comic_detail = JSON.parse(sessionStorage.getItem('comic_detail'));
            // this.isLogin = JSON.parse(sessionStorage.getItem('isLogin'));
            // this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
            // this.dataLevel = JSON.parse(sessionStorage.getItem('dataLevel'));
            // console.log(this.dataUser)
            this.movieNameSearch = JSON.parse(sessionStorage.getItem('movieNameSearch'));
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
        this.DOMAIN = new URL(window.location.href).origin + '/';
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
                const existsInOtherSeasons = this.otherSeasons.find(season => season.slug === movieSlug);
                if (!existsInOtherSeasons || !this.otherSeasons) {
                    this.otherSeasons = null;
                    this.fetchDataMovieRelated();
                }
                const match = movieSlug.match(/phan-(\d+)/); // Tìm số phần từ slug

                if (match) {
                    this.index_season = parseInt(match[1]); // Lấy số phần hiện tại
                }
    
            }
        }

        if (window.location.pathname === '/watch-movie') {
            const urlParams = new URLSearchParams(window.location.search);
            const number = urlParams.get('id');
            const num = number.split('-');
            const episodeNumber = parseInt(num[1], 10);
            const slug = urlParams.get('slug');
            if (episodeNumber) {
                this.movieSlug = slug;
                this.episodeNumber = episodeNumber;
                console.log(this.episodeNumber);
                this.fetchInfomationVideo();
                const existsInOtherSeasons = this.otherSeasons.find(season => season.slug === slug);
                if (!existsInOtherSeasons || !this.otherSeasons) {
                    this.otherSeasons = null;
                    this.fetchDataMovieRelated();
                }
                const match = slug.match(/phan-(\d+)/); // Tìm số phần từ slug

                if (match) {
                    this.index_season = parseInt(match[1]); // Lấy số phần hiện tại
                }
            }
        }

        if (window.location.pathname === '/search') {
            const urlParams = new URLSearchParams(window.location.search);
            const movieNameSearch = urlParams.get('keyword');
            this.page = parseInt(urlParams.get('page'), 10)
            if (movieNameSearch) {
                console.log(movieNameSearch)
                console.log(this.page)
                this.movieNameSearch = movieNameSearch;
                this.fetchSearchMovies(movieNameSearch);
            }
        }

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
