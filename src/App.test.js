import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { App, HomePage, SearchForm, ListingsPage, NewListing } from "./App";

import "@testing-library/jest-dom/extend-expect";

it("renders nav bar by default", () => {
  const { getAllByTestId } = render(<App />);
  const navBar = getAllByTestId("nav-bar");
  expect(navBar).toHaveLength(1);
});
it("nav bar has ul", () => {
  const { getAllByTestId } = render(<App />);
  const ul = getAllByTestId("ul");
  expect(ul).toHaveLength(1);
});
it("renders 4 tabs by default", () => {
  const { getAllByTestId } = render(<App />);
  const li = getAllByTestId("li");
  expect(li).toHaveLength(4);
});

it("renders search bar by default", () => {
  const { getAllByTestId } = render(<HomePage />);
  const searchBar = getAllByTestId("search-bar");
  expect(searchBar).toHaveLength(1);
});

it("renders filter by default", () => {
  const { getAllByTestId } = render(<HomePage />);
  const searchBar = getAllByTestId("filter");
  expect(searchBar).toHaveLength(1);
});
it("renders search bar by default", () => {
  const { getAllByTestId } = render(<SearchForm />);
  const searchInput = getAllByTestId("search-input");
  expect(searchInput).toHaveLength(1);
});
it("renders home page by default", () => {
  const { getAllByTestId } = render(<HomePage />);
  const home = getAllByTestId("homepage");
  expect(home).toHaveLength(1);
});
it("renders prompt by default", () => {
  const { getAllByTestId } = render(<HomePage />);
  const prompt = getAllByTestId("prompt");
  expect(prompt).toHaveLength(1);
});
it("renders results list by default", () => {
  const { getAllByTestId } = render(<HomePage />);
  const results = getAllByTestId("results-list");
  expect(results).toHaveLength(1);
});
it("renders form by default", () => {
  const { getAllByTestId } = render(<NewListing />);
  const checkForm = getAllByTestId("new-listing");
  expect(checkForm).toBeTruthy();
});

it("renders 19 input fields by default", () => {
  const { getAllByTestId } = render(<NewListing />);
  const checkInput = getAllByTestId("input-field");
  expect(checkInput).toHaveLength(19);
});

it("renders 14 error messages by default", () => {
  const { getAllByTestId } = render(<NewListing />);
  const checkInput = getAllByTestId("error-msg");
  expect(checkInput).toHaveLength(14);
});
it("renders 19 labels by default", () => {
  const { getAllByTestId } = render(<NewListing />);
  const checkInput = getAllByTestId("labels");
  expect(checkInput).toHaveLength(19);
});

it("renders header image", () => {
  const { getAllByTestId } = render(<ListingsPage />);
  const image = getAllByTestId("image-test");
  expect(image).toHaveLength(1);
});

it("renders results page", () => {
  const { getAllByTestId } = render(<ListingsPage />);
  const all = getAllByTestId("all");
  expect(all).toHaveLength(1);
});
