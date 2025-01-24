import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap-v5";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { connect, useDispatch } from "react-redux";
import {
    posSearchCodeProduct,
    posSearchNameProduct,
} from "../../../store/action/pos/posfetchProductAction";
import useSound from "use-sound";
import {
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import { addToast } from "../../../store/action/toastAction";
import { toastType } from "../../../constants";

const ProductSearchbar = (props) => {
    const {
        posAllProducts,
        customCart,
        setUpdateProducts,
        updateProducts,
        posSearchCodeProduct,
        posSearchNameProduct,
    } = props;
    const [searchString, setSearchString] = useState("");
    const [keyDown, setKeyDown] = useState(false);
    const dispatch = useDispatch();
    const [play] = useSound(
        "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
    );
    const filterProduct = posAllProducts
        .filter((qty) => qty.attributes.stock.quantity > 0)
        .map((item) => ({
            name: item.attributes.name,
            code: item.attributes.code,
            id: item.id,
        }));

    const formatResult = (item) => {
        return (
            <span style={{ display: "block", textAlign: "left" }}>
                {" "}
                {item.code} ({item.name})
            </span>
        );
    };

    const removeSearchClass = () => {
        const html =
            document.getElementsByClassName(`search-bar`)[0].firstChild
                .firstChild.lastChild;
        html.style.display = "none";
    };

    const onProductSearch = (code) => {
        const codeSearch = posAllProducts
            .filter(
                (item) =>
                    item.attributes.code === code ||
                    item.attributes.code === code.code
            )
            .map((item) => item.attributes.code);
        const nameSearch = posAllProducts
            .filter(
                (item) =>
                    item.attributes.name === code ||
                    item.attributes.name === code.name
            )
            .map((item) => item.attributes.name);
        const finalArrays = customCart.map((customId) =>
            code === customId.code ? customId.code : customId.name
        );
        const finalSearch = finalArrays.filter((finalArray) =>
            finalArray === codeSearch[0] ? codeSearch[0] : nameSearch[0]
        );
        const singleProduct = posAllProducts
            .filter(
                (product) =>
                    product.attributes.code === code ||
                    product.attributes.name === code ||
                    product.attributes.code === code.code ||
                    product.attributes.name === code.name
            )
            .map((product) => product.attributes.stock.quantity);
        const filterQty = updateProducts
            .filter(
                (item) =>
                    item.code === code ||
                    item.name === code ||
                    item.code === code.code ||
                    item.name === code.name
            )
            .map((qty) => qty.quantity)[0];
        if (finalSearch[0]) {
            if (codeSearch[0] === code) {
                posSearchCodeProduct(codeSearch[0]);
            } else {
                posSearchNameProduct(nameSearch[0]);
            }
            removeSearchClass();
            setSearchString("");
            play();
            let pushArray = [...customCart];
            let newProduct = pushArray.find(
                (element) =>
                    element.code === codeSearch[0] ||
                    element.name === nameSearch[0]
            );
            if (
                updateProducts.filter(
                    (item) =>
                        item.code === code ||
                        item.name === code ||
                        item.code === code.code ||
                        item.name === code.name
                ).length > 0
            ) {
                if (filterQty >= singleProduct[0]) {
                    dispatch(
                        addToast({
                            text: getFormattedMessage(
                                "pos.quantity.exceeds.quantity.available.in.stock.message"
                            ),
                            type: toastType.ERROR,
                        })
                    );
                } else {
                    setUpdateProducts((updateProducts) =>
                        updateProducts.map((item) =>
                            (item.code === code ||
                                item.name === code ||
                                item.code === code.code ||
                                item.name === code.name) &&
                            singleProduct[0] > item.quantity
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    );
                    setKeyDown(false);
                }
            } else {
                setUpdateProducts([...updateProducts, newProduct]);
                setKeyDown(false);
                removeSearchClass(true);
            }
        }
    };

    let scanProductBarCode = false;
    const handleOnSelect = (result) => {
        if (keyDown === false && scanProductBarCode === true) {
            onProductSearch(result);
            scanProductBarCode = false;
        }

        if (searchString.trim()?.length !== 0) {
            onProductSearch(result);
        }
    };

    const handleOnSearch = (string) => {
        if (searchString.trim() === "") {
            setSearchString(string);
            const codeSearch = posAllProducts.filter(
                (item) => item.attributes.code === string
            );
            if (codeSearch.length > 0) {
                if (codeSearch[0].attributes?.stock?.quantity > 0) {
                    if (codeSearch?.length === 1) {
                        scanProductBarCode = true;
                        const data = {
                            name: codeSearch[0]?.attributes?.name,
                            code: codeSearch[0]?.attributes?.code,
                            id: codeSearch[0]?.id,
                        };
                        handleOnSelect(data);
                        setSearchString("");
                    }
                } else {
                    dispatch(
                        addToast({
                            text: getFormattedMessage(
                                "pos.this.product.out.of.stock.message"
                            ),
                            type: toastType.ERROR,
                        })
                    );
                    setSearchString("");
                }
            }
        } else {
            setSearchString("");
        }
    };

    const inputFocus = () => {
        let searchInput = document.querySelector(
            'input[data-test="search-input"]'
        );
        searchInput.focus();
    };

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.altKey && event.code === "KeyQ") {
                event.preventDefault();
                inputFocus();
            }
        };

        document.addEventListener("keydown", keyDownHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, []);

    return (
        <Col className="position-relative my-3 search-bar col-xxl-8 col-lg-12 col-12">
            <ReactSearchAutocomplete
                placeholder={placeholderText("pos-globally.search.field.label")}
                items={filterProduct}
                onSearch={handleOnSearch}
                inputSearchString={searchString}
                fuseOptions={{ keys: ["name", "code"] }}
                resultStringKeyName="code"
                onSelect={(data) => {
                    handleOnSelect(data);
                }}
                formatResult={formatResult}
                showIcon={false}
                showClear={false}
                autoFocus={true}
            />
            <i className="bi bi-search fs-2 react-search-icon position-absolute top-0 bottom-0 d-flex align-items-center ms-2" />
        </Col>
    );
};

const mapStateToProps = (state) => {
    const { posAllProducts } = state;
    return { posAllProducts };
};

export default connect(mapStateToProps, {
    posSearchCodeProduct,
    posSearchNameProduct,
})(ProductSearchbar);
