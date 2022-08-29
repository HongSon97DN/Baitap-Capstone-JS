function SanPhamService() {

  this.danhSachSanPham = function () {
    var sanPham = axios({
      method: "get",
      url: 'https://62e69c570e5d74566aea1705.mockapi.io/Project-CAPSTONE',
    });
    return sanPham;
  };


  this.xemSanPham = function(id){
  return axios({
    method: 'get',
    url: `https://62e69c570e5d74566aea1705.mockapi.io/Project-CAPSTONE/${id}`,
  });
  };
  
}

