package com.smartcart.controller;

import com.smartcart.exception.ProductNotFoundException;
import com.smartcart.model.entity.Product;
import com.smartcart.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getProducts(@RequestParam(required = false) String category) {
        if (category != null) {
            return productRepository.findByCategory(category.toUpperCase());
        }
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}
