document.addEventListener("DOMContentLoaded", function () {
  let modal = document.getElementById("product-modal");
  let modalBody = modal.querySelector(".modal-body");
  let closeButton = modal.querySelector(".close-button");
  let productLinks = document.querySelectorAll(
    ".featured-products-grid .plus-icon"
  );
  let selectedVariantId = null;
  let softWinerJacketId = 49965338788132;

  productLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var handle = this.parentElement.getAttribute("data-handle");

      fetch("/products/" + handle + ".js")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          showPopUp(data);
        });
    });
  });

  function showPopUp(data) {
    let modalContent = document.createElement("div");
    modalContent.id = "modal-product-info";

    let lhs = document.createElement("div");
    lhs.classList.add("lhs");

    let rhs = document.createElement("div");
    rhs.classList.add("rhs");

    let productPic = document.createElement("div");
    productPic.id = "product-pic";
    let productImg = document.createElement("img");

    let productTitle = document.createElement("div");
    productTitle.id = "product-title";

    let productPrice = document.createElement("div");
    productPrice.id = "product-price";

    let productDescription = document.createElement("div");
    productDescription.id = "product-description";

    let colorVariations = document.createElement("div");
    colorVariations.classList.add("color-variations");
    let colorLabel = document.createElement("div");
    colorLabel.classList.add("color-label-text");
    colorLabel.innerText = "Color";
    colorVariations.appendChild(colorLabel);

    let sizeVariations = document.createElement("div");
    sizeVariations.classList.add("size-variations");
    let sizeLabel = document.createElement("div");
    sizeLabel.classList.add("size-label-text");
    sizeLabel.innerText = "Size";
    sizeVariations.appendChild(sizeLabel);

    // Create selectedSize element
    let selectedSize = document.createElement("div");
    selectedSize.id = "selectedSize";
    selectedSize.innerText = "Choose your size";
    sizeVariations.appendChild(selectedSize);

    let sizeWrapper = document.createElement("div");
    sizeWrapper.id = "sizeDropDownWrap";
    sizeWrapper.appendChild(sizeVariations);

    productPic.appendChild(productImg);
    lhs.appendChild(productPic);

    rhs.appendChild(productTitle);
    rhs.appendChild(productPrice);
    rhs.appendChild(productDescription);

    modalContent.appendChild(lhs);
    modalContent.appendChild(rhs);
    modalBody.appendChild(modalContent);
    modalBody.appendChild(colorVariations);
    modalBody.appendChild(sizeVariations);

    productImg.src = data.featured_image;
    productTitle.innerHTML = data.title;
    productPrice.innerHTML = (data.price / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
    productDescription.innerHTML = data.description;

    let productVariations = data.options;

    let colorsData = getColors(productVariations);
    let sizesData = getSizes(productVariations);

    addColorInputs(colorsData, colorVariations);
    addSizeDropDown(sizesData, sizeVariations);

    // Now that sizesList is in the DOM, we can attach event listeners
    let sizesMenu = document.getElementById("sizesList");
    let showDropDown = false;

    // Toggle dropdown visibility when selectedSize is clicked
    selectedSize.addEventListener("click", function () {
      if (showDropDown) {
        sizesMenu.style.display = "none";
        selectedSize.classList.remove("open");
        showDropDown = false;
      } else {
        sizesMenu.style.display = "block";
        selectedSize.classList.add("open");
        showDropDown = true;
      }
    });

    // Update selectedSize text when a size is selected
    let sizesListItems = sizesMenu.querySelectorAll("li");
    sizesListItems.forEach((sizeItem) => {
      sizeItem.addEventListener("click", function () {
        selectedSize.innerText = this.innerText;
        sizesMenu.style.display = "none";
        showDropDown = false;
        findVariantId(data, selectedSize.innerText);
      });
    });

    modal.style.display = "flex";
    console.log(data);
  }

  function getColors(variations) {
    for (let i = 0; i < variations.length; i++) {
      if (variations[i].name.toLowerCase() === "color") {
        console.log("colors data", variations[i]);
        return variations[i];
      }
    }
  }

  function addColorInputs(colors, div) {
    //add color input field
    for (let color of colors.values) {
      let colorDiv = document.createElement("div");
      colorDiv.classList.add("color-variant");
      let colorInput = document.createElement("input");
      let colorName = color.toLowerCase();
      colorInput.type = "radio";
      colorInput.name = "product-color";
      colorInput.value = colorName;
      colorInput.classList.add(`color-${colorName}`);
      colorInput.id = "var-" + colorName;
      colorDiv.appendChild(colorInput);

      //adding label for color input
      let colorLabel = document.createElement("label");
      colorLabel.htmlFor = "var-" + colorName; // Associate label with input via 'for' attribute
      colorLabel.classList.add("color-label");
      colorLabel.classList.add(`color-${colorName}`); // Add a class for styling
      colorLabel.innerText = colorName;
      colorLabel.style.borderLeft = "5px solid " + colorName;
      colorDiv.appendChild(colorLabel);
      div.appendChild(colorDiv);

      console.log(colorInput);
    }
  }

  // fetch all sizes variations
  function getSizes(variations) {
    for (let i = 0; i < variations.length; i++) {
      if (variations[i].name.toLowerCase() === "size") {
        console.log("sizes data", variations[i]);
        return variations[i];
      }
    }
  }

  /* Adding Custom Dropdown for sizes variants */
  function addSizeDropDown(sizes, div) {
    let sizesList = document.createElement("ul");
    sizesList.id = "sizesList";
    sizesList.style.display = "none"; // Hide dropdown initially

    for (let size of sizes.values) {
      let sizeItem = document.createElement("li");
      sizeItem.innerText = size;
      sizeItem.classList.add("sizeItem");
      sizesList.append(sizeItem);
    }
    div.appendChild(sizesList);
    console.log(div);
  }

  // Find variant id based on selected color & size
  function findVariantId(data, selectedSize) {
    //gets selected color value
    let selectedColor = '';
    document.querySelectorAll(".color-variant input").forEach((color) => {
      if(color.checked) {
          selectedColor = color.value;
          console.log("selected color", selectedColor);
      }
    })

    let variant = data.variants.find(variant => {
      return variant.option1 === selectedSize && variant.option2.toLowerCase() === selectedColor;
    });

    for(let i=0; i<data.variants.length; i++) {
      console.log("option 1", data.variants[i].option1);
      console.log("option 2", data.variants[i].option2)
    }
    console.log(selectedColor)
    console.log(selectedSize)


    if (variant) {
      selectedVariantId = variant.id;
      console.log('Selected Variant ID:', selectedVariantId);
    } else {
      console.log('Variant not found');
    }

  }

  // Add to Cart button event
  document.querySelector('.modal-cta .btn').addEventListener('click', function (e) {
    e.preventDefault();
    if (selectedVariantId) {
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedVariantId,
          quantity: 1,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Product added to cart', data);
        alert('Product added to cart!');
        if (data.variant_options.includes("Black") && data.variant_options.includes("M")) {
          // Automatically add the "Soft Winter Jacket" to the cart
          fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: softWinerJacketId,  // Use the actual variant ID of the Soft Winter Jacket
              quantity: 1,
            }),
          })
          .then(response => response.json())
          .then(data => {
            console.log('Soft Winter Jacket added to cart', data);
            alert('Soft Winter Jacket added to cart!');
          })
          .catch(error => {
            console.error('Error adding Soft Winter Jacket to cart', error);
          });
        }
      })
      .catch(error => {
        console.error('Error adding product to cart', error);
      });
    } else {
      alert('Please select a size and color first!');
    }
  });

  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
    modalBody.innerHTML = "";
  });

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      modalBody.innerHTML = "";
    }
  });
});
