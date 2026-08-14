package com.neophron.productmanagement.controller;

import com.neophron.productmanagement.dto.SubCategoryRequest;
import com.neophron.productmanagement.entity.Category;
import com.neophron.productmanagement.entity.SubCategory;
import com.neophron.productmanagement.service.SubCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;

    public SubCategoryController(SubCategoryService subCategoryService) {
        this.subCategoryService = subCategoryService;
    }

    @PostMapping
    public ResponseEntity<SubCategory> createSubCategory(
            @RequestBody SubCategoryRequest request) {

        SubCategory subCategory =
                subCategoryService.createSubCategory(
                        request.getSubCategoryName(),
                        request.getCategoryId()
                );

        return ResponseEntity.ok(subCategory);
    }
    @GetMapping
    public List<SubCategory> getAllSubCategories() {
        return subCategoryService.getAllSubCategories();
    }
    @GetMapping("/{id}")
    public ResponseEntity<SubCategory> getSubCategoryById(@PathVariable Long id) {
        return subCategoryService.getSubCategoryById(id)
                .map(subCategory -> ResponseEntity.ok(subCategory))
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<SubCategory> updateSubCategory(
            @PathVariable Long id,
            @RequestBody SubCategory subCategoryDetails) {

        return subCategoryService.updateSubCategory(id, subCategoryDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubCategory(@PathVariable Long id) {

        if (subCategoryService.deleteSubCategory(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

}