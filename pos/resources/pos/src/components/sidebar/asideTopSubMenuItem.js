import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Permissions } from "../../constants";

const AsideTopSubMenuItem = (props) => {
    const { asideConfig, isMenuCollapse } = props;
    const config = useSelector((state) => state.config);
    const location = useLocation();
    const id = useParams();

    return (
        <nav
            className={`navbar navbar-expand-xl ${
                isMenuCollapse === true ? "top-navbar" : "top-nav-heding"
            } navbar-light d-xl-flex align-items-stretch d-block px-3 px-xl-0 py-4 py-xl-0`}
        >
            <div className="navbar-collapse">
                <Dropdown className="d-flex align-items-stretch me-3 report_dropdown">
                    <Dropdown.Toggle
                        className="hide-arrow bg-transparent border-0 p-0 d-flex align-items-center"
                        id="dropdown-basic"
                    >
                        <FontAwesomeIcon
                            icon={faPlusSquare}
                            className="shortcut-btn px-sm-3 px-2 d-flex text-decoration-none pos-button pos-button-highlight"
                        />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="shortcut-menu">
                        {config?.includes(Permissions.MANAGE_SALE) && (
                            <Dropdown.Item className="py-0 fs-4">
                                <Link
                                    to={"/app/sales/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage("sales.title")}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                        {config?.includes(Permissions.MANAGE_PURCHASE) && (
                            <Dropdown.Item className="py-0 fs-6">
                                <Link
                                    to={"/app/purchases/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage("purchase.title")}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                        {config?.includes(Permissions.MANAGE_CUSTOMERS) && (
                            <Dropdown.Item className="py-0 fs-6">
                                <Link
                                    to={"/app/customers/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage(
                                            "dashboard.recentSales.customer.label"
                                        )}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                        {config?.includes(Permissions.MANAGE_SUPPLIERS) && (
                            <Dropdown.Item className="py-0 fs-6">
                                <Link
                                    to={"/app/suppliers/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage("supplier.title")}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                        {config?.includes(Permissions.MANAGE_PRODUCTS) && (
                            <Dropdown.Item className="py-0 fs-6">
                                <Link
                                    to={"/app/products/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage(
                                            "dashboard.stockAlert.product.label"
                                        )}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                        {config?.includes(Permissions.MANAGE_EXPENSES) && (
                            <Dropdown.Item className="py-0 fs-6">
                                <Link
                                    to={"/app/expenses/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage("expense.title")}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <div className="navbar-nav me-auto mb-2 mb-lg-0">
                    {location.pathname === "/app/profile/edit" ? (
                        <div className="nav-item position-relative mx-xl-3 mb-3 mb-xl-0">
                            <Link
                                to="/app/profile/edit"
                                className={`${
                                    location.pathname === "/app/profile/edit"
                                        ? "active"
                                        : ""
                                } nav-link p-0`}
                            >
                                <span>
                                    {getFormattedMessage(
                                        "update-profile.title"
                                    )}
                                </span>
                            </Link>
                        </div>
                    ) : (
                        asideConfig &&
                        asideConfig.map((mainItems, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`${
                                        location.pathname === mainItems.to ||
                                        location.pathname === mainItems.path ||
                                        location.pathname ===
                                            mainItems.stockPath ||
                                        location.pathname ===
                                            mainItems.productPath ||
                                        location.pathname ===
                                            mainItems.purchasePath ||
                                        location.pathname ===
                                            mainItems.topSellingPath ||
                                        location.pathname ===
                                            mainItems.productQuantityAlertPath ||
                                        location.pathname ===
                                            mainItems.prefixesPath ||
                                        location.pathname ===
                                            mainItems.supplierReportPath ||
                                        location.pathname ===
                                            mainItems.customerReportPath ||
                                        location.pathname ===
                                            mainItems.bestCustomerReportPath ||
                                        location.pathname ===
                                            mainItems.registerReportPath ||
                                        location.pathname ===
                                            mainItems.mailSettingsPath ||
                                        location.pathname ===
                                            mainItems.profitLossReportPath ||
                                        location.pathname.includes(
                                            mainItems.to
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.userSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.customerSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.suppliareSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.productsSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.categoriesSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.brandsSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.unitsSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.baseUnitsSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.barcodeSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.purchasesSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.purchaseReturnSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.salesSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.salesReturnSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.expensesSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.expenseCategoriesSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.emailTemplateSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath
                                                ?.smsTemplateSubPath
                                        ) ||
                                        location.pathname.includes(
                                            mainItems?.subPath?.smsApiSubPath
                                        ) ||
                                        location.pathname ===
                                            mainItems.stockDetailPath +
                                                "/" +
                                                id.id ||
                                        location.pathname ===
                                            mainItems.customerReportDetailsPath +
                                                "/" +
                                                id.id ||
                                        location.pathname ===
                                            mainItems.supplierReportDetailsPath +
                                                "/" +
                                                id.id
                                            ? "d-flex align-items-center"
                                            : "d-none"
                                    }`}
                                >
                                    {mainItems.items
                                        ? mainItems.items.map((item, index) => {
                                              if (index <= 4) {
                                                  return (
                                                      <div
                                                          key={index}
                                                          className={`nav-item ${
                                                              location.pathname.includes(
                                                                  "report"
                                                              )
                                                                  ? "report-nav-item"
                                                                  : ""
                                                          } position-relative mx-xl-3 mb-3 mb-xl-0 mx-1`}
                                                      >
                                                          <Link
                                                              to={item.to}
                                                              className={`nav-link p-0 ${
                                                                  location.pathname ===
                                                                      item.to ||
                                                                  (mainItems.isSamePrefix
                                                                      ? null
                                                                      : location.pathname.includes(
                                                                            mainItems.to
                                                                        )) ||
                                                                  location.pathname ===
                                                                      item.detail +
                                                                          "/" +
                                                                          id.id ||
                                                                  location.pathname ===
                                                                      "/app/profile/edit"
                                                                      ? " active"
                                                                      : ""
                                                              }`}
                                                          >
                                                              {location.pathname ===
                                                              "/app/profile/edit" ? (
                                                                  <span>
                                                                      {getFormattedMessage(
                                                                          "update-profile.title"
                                                                      )}
                                                                  </span>
                                                              ) : (
                                                                  <span>
                                                                      {
                                                                          item.title
                                                                      }
                                                                  </span>
                                                              )}
                                                          </Link>
                                                      </div>
                                                  );
                                              }
                                          })
                                        : mainItems?.subMenu?.map(
                                              (item, index) => {
                                                  return location.pathname ===
                                                      item.to ||
                                                      location.pathname.includes(
                                                          item.to
                                                      ) ? (
                                                      <div
                                                          key={index}
                                                          className="nav-item position-relative mx-xl-3 mb-3 mb-xl-0 mx-1"
                                                      >
                                                          <Link
                                                              to={item.to}
                                                              className={`nav-link p-0 ${
                                                                  location.pathname ===
                                                                      item.to ||
                                                                  location.pathname.includes(
                                                                      item.to
                                                                  ) ||
                                                                  (mainItems.isSamePrefix
                                                                      ? null
                                                                      : location.pathname.includes(
                                                                            mainItems.to
                                                                        )) ||
                                                                  location.pathname ===
                                                                      item.detail +
                                                                          "/" +
                                                                          id.id ||
                                                                  location.pathname ===
                                                                      "/app/profile/edit"
                                                                      ? " active"
                                                                      : ""
                                                              }`}
                                                          >
                                                              <span>
                                                                  {getFormattedMessage(
                                                                      item.title
                                                                  )}
                                                              </span>
                                                          </Link>
                                                      </div>
                                                  ) : null;
                                              }
                                          )}
                                    {/* Report Dropdown  */}
                                    {location.pathname.includes("report") && (
                                        <Dropdown className="d-flex align-items-stretch">
                                            <Dropdown.Toggle
                                                className="hide-arrow bg-transparent border-0 p-0 d-flex align-items-center"
                                                id="dropdown-basic"
                                            >
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <span className="ms-2 text-gray-600 d-none d-sm-block">
                                                        {getFormattedMessage(
                                                            "more-report.option.title"
                                                        )}
                                                    </span>
                                                </div>
                                                <FontAwesomeIcon
                                                    icon={faAngleDown}
                                                    className="text-gray-600 ms-2 d-none d-sm-block"
                                                />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="mt-6">
                                                {mainItems.items &&
                                                    mainItems.items.map(
                                                        (item, index) => {
                                                            if (index >= 5) {
                                                                return (
                                                                    <Dropdown.Item
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="px-0 py-0 fs-6"
                                                                        active={
                                                                            location.pathname ===
                                                                                item.to ||
                                                                            location.pathname.includes(
                                                                                item.to
                                                                            )
                                                                                ? true
                                                                                : false
                                                                        }
                                                                    >
                                                                        <div className="position-relative mx-xl-3 mb-3 mb-xl-0 ">
                                                                            <Link
                                                                                to={
                                                                                    item.to
                                                                                }
                                                                                className={`nav-link px-3 py-2 ${
                                                                                    location.pathname ===
                                                                                        item.to ||
                                                                                    (mainItems.isSamePrefix
                                                                                        ? null
                                                                                        : location.pathname.includes(
                                                                                              mainItems.to
                                                                                          )) ||
                                                                                    location.pathname ===
                                                                                        item.detail +
                                                                                            "/" +
                                                                                            id.id ||
                                                                                    location.pathname ===
                                                                                        "/app/profile/edit"
                                                                                        ? "text-white"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                <span>
                                                                                    {
                                                                                        item.title
                                                                                    }
                                                                                </span>
                                                                            </Link>
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                );
                                                            }
                                                        }
                                                    )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </nav>
    );
};

export default AsideTopSubMenuItem;
