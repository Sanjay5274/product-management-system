package com.neophron.productmanagement.repository;

import com.neophron.productmanagement.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
}