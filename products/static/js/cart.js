function addProduct(id) {
  const btn = $(`#${id}`);
  const qty = $(`#${id}-qty`).val();

  $.ajax({
    url: "/home/add-to-cart",
    data: {
      id: id,
      qty: qty ? qty : 1,
    },
    dataType: "json",
    beforeSend: function () {
      btn.attr("disabled", true);
    },
    success: function (response) {
      $("#badge-count").text(response.totalitems);

      if (productAlreadyInCart(id)) {
        increaseQtyByOne(id);
        updateTotalPrice(id, response);
      } else {
        addItem(id, response);
      }

      updateCartTotal(response);

      btn.attr("disabled", false);
    },
  });
}

function removeProduct(id) {
  const btn = $(`#${id}`);
  id = getIdFromString(id);

  $.ajax({
    url: "/home/remove-from-cart",
    data: {
      id: id,
    },
    dataType: "json",
    beforeSend: function () {
      btn.attr("disabled", true);
    },
    success: function (response) {
      $(`.cart-items > #cart-${id}`).remove();
      $(`#product-checkout-${id}`).remove();

      $("#badge-count").text(response.totalitems);

      updateCartTotal(response);

      btn.attr("disabled", false);
    },
  });
}

function productAlreadyInCart(id) {
  return $(`.cart-items > #cart-${id}`).length;
}

function increaseQtyByOne(id) {
  const qty_span = $(`.cart-items > #cart-${id} > #cart-qty-${id}`);
  const currentQty = Number(qty_span.text().substring(1));
  qty_span.text(`x${currentQty + 1}`);
}

function updateTotalPrice(id, response) {
  $(`.cart-items > #cart-${id} > #cart-price-${id}`).text(
    `$${response.data[id].total}`
  );
}

function updateCartTotal(response) {
  if (response.totalprice) {
    $("#checkout-total").text(`Total: $${response.totalprice}`);
    $(".price").text(`$${response.totalprice}`);

    $(".checkout-btn").removeClass("hidden");

    $("#complete-purchase").prop("disabled", false);
  } else {
    $("#checkout-total").text("Your cart is empty.");
    $(".checkout-btn").addClass("hidden");

    $("#complete-purchase").prop("disabled", true);
  }
}

function addItem(id, response) {
  $(".cart-items")
    .last()
    .append(
      cartItemHTML(
        id,
        response.data[id].name,
        response.data[id].img_url,
        response.data[id].total
      )
    );
}

function getIdFromString(id) {
  const match = id.match(/\d+/);
  return parseInt(match[0], 10);
}

function cartItemHTML(id, name, img, price) {
  return `
  <div id="cart-${id}" class="cart-item-container">
    <a href="/home/browse/product/${id}" class="grid grid-flow-col auto-cols-max w-40">
      <div class="w-16">
        <img src="${img}" class="max-h-12 mx-auto" />
      </div>
      <span class="break-words w-24 px-2 my-auto">${name}</span>
    </a>
    <span id="cart-qty-${id}" class="w-6 my-auto">x1</span>
    <span id="cart-price-${id}" class="w-16 font-bold my-auto">$${price}</span>
    <button id="remove-${id}" onclick="removeProduct(this.id)" class="remove-btn">X</button>
  </div>
  `;
}

$("body").on("DOMSubtreeModified", "#badge-count", function () {
  const count = $("#badge-count").text();
  console.log(count);
  if (count === "0" || count === "") {
    $("#badge-count").removeClass("inline-flex");
  } else {
    $("#badge-count").addClass("inline-flex");
  }
});
