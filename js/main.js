// global
var productList = [];
var spService = new SanPhamService();
var spGH = new SanPhamGioHang();
var DSGH = new DanhSachGioHang();


function danhSachSanPham() {
  spService
    .danhSachSanPham()
    .then(function (result) {
      productList.push(result.data);
      hienThiSanPham(result.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
danhSachSanPham();

function hienThiSanPham(productList) {
  var content = "";
  productList.map(function (sp, index) {
    content += `
          <form class="card" id="card">
              <div class="card-img">
                  <img style="width:200px;" class="form-dt" id="hinh" src="${sp.img}"  alt="...">
              </div>
              <div class="card-content">
                    <div class="card-top">
                        <h5 class="card-title form-dt" id="name">${sp.name}</h5>
                        <p class="my-3" style="font-weight:600;">Thông số kỹ thuật</p>
                        <ul class="card-text">
                          <li class="form-dt" >${sp.screen}</li>
                          <li class="form-dt" >FrontCamera: ${sp.frontCamera}</li>
                          <li class="form-dt" >BackCamera: ${sp.backCamera}</li>
                          <li class="form-dt" >${sp.desc}</li>
                          <li class="form-dt" id="gia" >Price : ${sp.price}</li>
                       </ul>
                    </div>
                    <div class="card-bottom">
                        <button type="button" onclick="themSanPham('${sp.id}')" class="btn btn-primary">Thêm vào giỏ hàng</button>
                    </div>
              </div>
          </form> 
        `;
  });
  document.querySelector("#productList").innerHTML = content;
}

function hienThiTimKiem() {
  var phone = [];
  var value = document.getElementById("selectSearch").value;
  productList.filter(function (sp, index) {
    if (value === "iphone") {
      for (var i = 0; i < sp.length; i++) {
        if (sp[i].type === "Iphone") {
          phone.push(sp[i]);
          hienThiSanPham(phone);
        }
      }
    } else if (value === "samsung") {
      for (var i = 0; i < sp.length; i++) {
        if (sp[i].type === "Samsung") {
          phone.push(sp[i]);
          hienThiSanPham(phone);
        }
      }
    } else {
      for (var i = 0; i < sp.length; i++) {
        if (sp[i].type === "Samsung" || sp[i].type === "Iphone") {
          phone.push(sp[i]);
          hienThiSanPham(phone);
        }
      }
    }
  });
}

let mangGH = [];
let i = 0;
function themSanPham(id) {

  i++;
  document.getElementById("cart-count").value = i;
  document.getElementById("cart-count").innerHTML = i;

  spService
    .xemSanPham(id)
    .then((result) => {

      if (mangGH.some((sp) => sp.id === id)) {
        mangGH.map((item) => {
          if (item.id === id) {
            item.sl += 1;
          }
        })
      } else {
        var spGH = new SanPhamGioHang(
          result.data.id,
          result.data.img,
          result.data.name,
          result.data.sl,
          result.data.price,
          result.data.total
        );
        mangGH.push(spGH);
 
      }
      hienThispGH(mangGH)

    })
    .catch((error) => {
      console.log(error);
    });
}

function hienThispGH(mangGH) {
  let content = "";
  mangGH.map(function (spGH, index) {
    content += `
      <tr>
       <td style="display: flex; align-items: center;">
       <img style="width: 70px;" src="${spGH.img}" alt="">${spGH.name}
       </td>
       <td>MS: 
          <span>${spGH.id}</span>
       </td> 
       <td><span>${spGH.price}</span></td>
       <td>
        <input onchange="thanhTien('${spGH.id}')" id="inputSL${spGH.id}" name=${spGH.id}" style="width: 50px; text-align:center;" type="number" value="${spGH.sl}" min="1"> 
       </td> 
       <td id="thanhTien${spGH.id}" class="thanhTienSPGH">
          ${spGH.sl * spGH.price}
       </td>
       <td>
           <button onclick="xoaSanPham('${spGH.id}')" style="width:50px;" type="button" class="btn btn-danger text-center"> Xóa </button>
       </td>
     </tr> 
     `;
  });
  document.getElementById("cart").innerHTML = content + `
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>
      <button onclick="" id="clearGH" class="btn btn-danger" type="button">Clear</button>
    </td>
    <td>
        <button onclick="tongTienGH()"  id="tinhTienGH" class="btn btn-success" type="button">Thanh toán</button>
    </td>
   </tr>
   <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
      <td style="font-weight:600">Tổng tiền:
        <span id="showTotalMoney"></span>
      </td>
   </tr>
  `;
}

function hienThiGioHang() {
  document.querySelector(".cart").style.display = "block";
}
document.querySelector(".gioHang").onclick = hienThiGioHang;

function tatGioHang() {
  document.querySelector(".cart").style.display = "none";
}
document.querySelector("#close").onclick = tatGioHang;


function thanhTien(id) {

  let spFind = mangGH.find((spGH) => {
    return spGH.id == id;
  });

  if (spFind) {
    let sl = document.querySelector(`#inputSL${id}`).value;

    spFind.sl = sl;
    document.querySelector(`#thanhTien${id}`).innerHTML = sl * spFind.price;

    //lưu local ở đây

  }

  return spFind;
}

let tongTienGH = () => {
  let total = 0;
  mangGH.map((sp) => {
    total += sp.sl * sp.price;
  })

  document.getElementById("showTotalMoney").innerHTML = total.toLocaleString() + "$";
}

let timViTri = (id) => {
  let viTri = -1;
  mangGH.map((sp, index) => {
    if (sp.id === id) {
      viTri = index;
    }
  })
  return viTri;
}

let xoaSanPham = (id) => {
  var viTri = timViTri(id);

  if (viTri > -1) {
    mangGH.splice(viTri, 1);
  }
  hienThispGH(mangGH);
}


