package com.neophron.productmanagement.dto;

public class SubCategoryRequest {

    private String subCategoryName;
    private Long categoryId;

    public SubCategoryRequest() {
    }

    public String getSubCategoryName() {
        return subCategoryName;
    }

    public void setSubCategoryName(String subCategoryName) {
        this.subCategoryName = subCategoryName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}