package com.smartcart.exception;

public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(Long id) {
        super("Ürün bulunamadı: " + id);
    }
}
