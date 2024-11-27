$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        items: 2, // Hiển thị 2 item
        margin: 10, // Khoảng cách giữa các item
        loop: true, // Cho phép lặp
        nav: true, // Hiển thị nút điều hướng
        slideBy: 2, // Nhảy 2 item mỗi lần
        center: false, // Không căn giữa item
        stagePadding: 0, // Không có padding
        autoplay: true,
        autoplayTimeout: 4000,
        responsive: {
            0: {
                items: 1,
                slideBy: 1
            },
            600: {
                items: 2,
                slideBy: 2
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    
    
});


