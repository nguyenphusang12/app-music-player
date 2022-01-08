const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2')
const cdThumb = $('.cd_img')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn.btn-toggle-play');
const inputRange = $('.progress');
const nextSong = $('.btn-next');
const prevSong = $('.btn-previous');
const randomBtn = $('.btn-random');
const repeat = $('.btn-repeat');
const PLAYER_STORAGE_KEY = 'F8_MUSIC';
//Xu li margin cua playlist voi dashboard
const dashBoard = $('.dashborad');
const playList = $('.playlist');
playList.style.marginTop = dashBoard.offsetHeight + 'px';

//Đang xử lí active song khi cuộn

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
            id: 1,
            name: 'Bỏ em vào balo',
            singer: 'Tân Trần, Freak D',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.webp'
        },
        {
            id: 2,
            name: 'Cafe không đường',
            singer: 'G5RSquad',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            id: 3,
            name: 'Chỉ là không cùng nhau',
            singer: 'Tăng Phúc, Trương Thảo Nhi',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.webp'
        },
        {
            id: 4,
            name: 'Chiều thu họa bóng nàng',
            singer: 'DatKaa',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            id: 5,
            name: 'Cô độc vương',
            singer: 'Thiên Tú',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            id: 6,
            name: 'Cô đơn dành cho ai',
            singer: 'Lee Ken, Nal',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            id: 7,
            name: 'Đường tôi chở em về',
            singer: 'Bui Truong Linh',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            id: 8,
            name: 'Em có yêu anh không',
            singer: 'Khánh Phương',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            id: 9,
            name: 'Gặp nhưng không ở lại',
            singer: 'Hiền Hồ, Vương Anh Tú',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.webp'
        },
        {
            id: 10,
            name: 'Hạ còn vương nắng',
            singer: 'DatKaa, Kido',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.webp'
        },
        {
            id: 11,
            name: 'Họ yêu ai mất rồi',
            singer: 'Doãn Hiếu, B',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {

        const htmls = this.songs.map(song => {
            return `<div class="song-item" data-ids="${song.id}">
                        <div class="song-img" style='background-image: url("${song.image}")'></div>
                        <div class="song-body">
                            <h2 class="song-name">${song.name}</h2>
                            <p class="song-singer">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                    `
        })
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    handleEvents: function() {
        const _this = this;

        //Xử lí phóng to tthu nhỏ khi cuộn
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newWidth = cdWidth - scrollTop;

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }

        //Xử lí khi click Play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //Xử lí cd quay và dừng
        const cdThumbAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimation.pause()

        //Khi song dc play
        audio.onplay = function() {
            //Xử lí active bài hát đang chạy
            if ($('.song-item.active')) {
                $('.song-item.active').classList.remove('active');
            }
            const idCurrentSong = _this.currentSong.id;
            const allSongs = $$('.song-item');
            for (let index = 0; index < allSongs.length; index++) {
                if (allSongs[index].getAttribute('data-ids') == idCurrentSong) {
                    allSongs[index].classList.add('active');
                    break;
                }
            }


            cdThumbAnimation.play();
            _this.isPlaying = true;
            playBtn.classList.add('active');
        }

        //Khi song dc pause
        audio.onpause = function() {
            cdThumbAnimation.pause();
            _this.isPlaying = false;
            playBtn.classList.remove('active');
        }

        //xử lí khi tua song
        inputRange.oninput = function() {
            audio.currentTime = this.value;
            // audio.currentTime = audio.duration / 100 * this.value;
        }

        // khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if (this.currentTime > 0) {
                inputRange.max = audio.duration;

                // inputRange.value = Math.floor((this.currentTime / this.duration) * 100);
                inputRange.value = this.currentTime;
            }
        }

        //khi next song
        nextSong.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }

            audio.play();
            _this.scrollToActiveSong();
        }

        //Xử lí khi bài hát kết thúc
        audio.onended = function() {
            if ((_this.isRepeat) || (_this.isRepeat && _this.isRandom)) {
                _this.loadCurrentSong();

            } else if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }

            this.play();
        }

        //khi previous song
        prevSong.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }

            audio.play();
            _this.scrollToActiveSong();
        }

        // random bai hat
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lí lặp lại
        repeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            this.classList.toggle('active', _this.isRepeat);
        }

        // xử lí khi click danh sách song
        playList.onclick = function(e) {
            var songNode = e.target.closest('.song-item:not(.active)');
            if (
                (songNode) || (e.target.closest('.option'))
            ) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.ids) - 1;
                    _this.loadCurrentSong();
                    audio.play();
                }
                if (e.target.closest('.option')) {
                    alert('Thông cảm! Chức năng đang phát triển');
                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song-item.active').scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
        }, 200)
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function() {
        let newCurrentIndex;
        do {
            newCurrentIndex = Math.floor(Math.random() * this.songs.length)
        } while (newCurrentIndex === this.currentIndex)
        this.currentIndex = newCurrentIndex;
        this.loadCurrentSong();
    },
    start: function() {
        //Gán cấu hình từ config vào Ứng dụng
        this.loadConfig();

        //Định nghĩa thuộc tính cho object
        this.defineProperties();

        //lắng nghe sự kiện và xử lí
        this.handleEvents();

        //Tải bài hát đầu tiêm khi chạy ứng dụng vào UI
        this.loadCurrentSong();


        //render playlist
        this.render()

        if (this.config.isRandom !== undefined) {
            randomBtn.classList.toggle('active', this.isRandom);
        }
        if (this.config.isRepeat !== undefined) {
            repeat.classList.toggle('active', this.isRepeat);
        }

    }
}
app.start();