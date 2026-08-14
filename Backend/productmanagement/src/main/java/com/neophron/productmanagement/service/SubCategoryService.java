package com.neophron.productmanagement.service;

import com.neophron.productmanagement.entity.Category;
import com.neophron.productmanagement.entity.SubCategory;
import com.neophron.productmanagement.repository.CategoryRepository;
import com.neophron.productmanagement.repository.SubCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;
    private final CategoryRepository categoryRepository;
//    private final SubCategoryRepository subCategoryRepository;

    public SubCategoryService(
            SubCategoryRepository subCategoryRepository,
            CategoryRepository categoryRepository) {

        this.subCategoryRepository = subCategoryRepository;
        this.categoryRepository = categoryRepository;
    }

    public SubCategory createSubCategory(
            String subCategoryName,
            Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        SubCategory subCategory = new SubCategory();

        subCategory.setSubCategoryName(subCategoryName);
        subCategory.setCategory(category);

        return subCategoryRepository.save(subCategory);
    }
    public List<SubCategory> getAllSubCategories() {
        return subCategoryRepository.findAll();
    }
    public Optional<SubCategory> getSubCategoryById(Long id) {
        return subCategoryRepository.findById(id);
    }
    public Optional<SubCategory> updateSubCategory(Long id, SubCategory subCategoryDetails) {
        return subCategoryRepository.findById(id)
                .map(subCategory -> {
                    subCategory.setSubCategoryName(subCategoryDetails.getSubCategoryName());
                    if (subCategoryDetails.getCategory() != null) {
                        subCategory.setCategory(subCategoryDetails.getCategory());
                    }
                    return subCategoryRepository.save(subCategory);
                });
    }
    public boolean deleteSubCategory(Long id) {
        if (subCategoryRepository.existsById(id)) {
            subCategoryRepository.deleteById(id);
            return true;
        }

        return false;
    }

}