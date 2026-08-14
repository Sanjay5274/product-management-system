package com.neophron.productmanagement.service;

import com.neophron.productmanagement.dto.ProductRequest;
import com.neophron.productmanagement.entity.Category;
import com.neophron.productmanagement.entity.Product;
import com.neophron.productmanagement.entity.SubCategory;
import com.neophron.productmanagement.repository.CategoryRepository;
import com.neophron.productmanagement.repository.ProductRepository;
import com.neophron.productmanagement.repository.SubCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            SubCategoryRepository subCategoryRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
    }

    public Product createProduct(ProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        SubCategory subCategory = subCategoryRepository.findById(request.getSubCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("SubCategory not found"));

        if (!subCategory.getCategory().getId().equals(category.getId())) {
            throw new RuntimeException(
                    "SubCategory does not belong to the selected Category");
        }


        Product product = new Product();

        product.setProductName(request.getProductName());
        product.setProductCode(request.getProductCode());
        product.setCategory(category);
        product.setSubCategory(subCategory);
        product.setBrand(request.getBrand());
        product.setMrp(request.getMrp());
        product.setPrice(request.getPrice());

        return productRepository.save(product);
    }
    //GET
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    //GET by ID
    public java.util.Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    //PUT
    public Optional<Product> updateProduct(Long id, ProductRequest request) {

        return productRepository.findById(id)
                .map(product -> {

                    Category category = categoryRepository.findById(request.getCategoryId())
                            .orElseThrow(() ->
                                    new RuntimeException("Category not found"));

                    SubCategory subCategory = subCategoryRepository.findById(request.getSubCategoryId())
                            .orElseThrow(() ->
                                    new RuntimeException("SubCategory not found"));

                    if (!subCategory.getCategory().getId().equals(category.getId())) {
                        throw new RuntimeException(
                                "SubCategory does not belong to the selected Category");
                    }

                    product.setProductName(request.getProductName());
                    product.setProductCode(request.getProductCode());
                    product.setCategory(category);
                    product.setSubCategory(subCategory);
                    product.setBrand(request.getBrand());
                    product.setMrp(request.getMrp());
                    product.setPrice(request.getPrice());

                    return productRepository.save(product);

                });
    }
    //DELETE
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}