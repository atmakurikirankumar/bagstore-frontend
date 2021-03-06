import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./fixedPrices";
import { getCategories, getFilteredProducts } from "./apiCore";
import Spinner from "./Spinner";

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(8);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const loadFilteredResults = (newFilters) => {
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setFilteredResults(data.data);
        setSize(data.size);
        setLoading(false);
        setSkip(0);
      }
    });
  };

  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  const loadMore = () => {
    let toSkip = skip + limit;
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const showLoading = () => loading && <Spinner />;

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-warning mb-5">
          Load More
        </button>
      )
    );
  };

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === "price") {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  const handlePrice = (value) => {
    const data = prices;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  return (
    <div
      title="Shop a wide range of products of your choice"
      description="All varities of custom stylized bags for you"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-md-12">
          <div className="jumbotron text-left" style={{ borderRadius: "20px" }}>
            <h1>Navigate through a wide of our customized stylish bags of your choice </h1>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-2">
          <h4
            className="card text-white text-center bg-primary jumbo"
            style={{
              borderRadius: "50px",
            }}
          >
            By Category
          </h4>
          <ul>
            <Checkbox
              categories={categories}
              handleFilters={(filters) => handleFilters(filters, "category")}
            />
          </ul>

          <h4
            className="card text-white text-center bg-primary jumbo"
            style={{
              borderRadius: "50px",
            }}
          >
            By Price
          </h4>
          <div>
            <RadioBox
              prices={prices}
              handleFilters={(filters) => handleFilters(filters, "price")}
            />
          </div>
        </div>

        <div className="col-10">
          {showLoading()}
          {!loading && filteredResults && filteredResults.length > 0 && (
            <>
              <div className="row">
                {filteredResults.map((product, i) => (
                  <div key={i} className="col-3 mb-3">
                    <Card product={product} />
                  </div>
                ))}
              </div>
            </>
          )}
          {!loading && filteredResults && filteredResults.length <= 0 && (
            <div className="container card">
              <h2 className="text-danger">
                No Products found matching your search criteria. Please refine your search and try
                again
              </h2>
            </div>
          )}
          <hr />
          {loadMoreButton()}
        </div>
      </div>
    </div>
  );
};

export default Shop;
