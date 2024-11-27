class FetchDataProvider {
    constructor(baseUrl) {
        this.baseUrl = baseUrl; // Đặt URL gốc để dễ tái sử dụng
    }

    /**
     * Fetch dữ liệu từ API.
     * @param {string} typeName - Tên loại cần fetch.
     * @param {number} page - Số trang cần fetch.
     * @returns {Promise<object>} - Promise trả về dữ liệu JSON hoặc lỗi.
     */
    fetchListMovie(page) {
        const url = `https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=${page}`;
        
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data);
                return data; // Trả về dữ liệu
            })
            .catch(error => {
                console.error('Error fetching comics:', error);
                throw error; // Ném lỗi để xử lý bên ngoài nếu cần
            });
    }

    fetchDetailMovie(slug) {
        const url = `https://phimapi.com/phim/${slug}`;
        
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data);
                return data; // Trả về dữ liệu
            })
            .catch(error => {
                console.error('Error fetching comics:', error);
                throw error; // Ném lỗi để xử lý bên ngoài nếu cần
            });
    }
}

module.exports = new FetchDataProvider;
