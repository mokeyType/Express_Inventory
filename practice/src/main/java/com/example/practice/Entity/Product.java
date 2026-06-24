package com.example.practice.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Product_id")
    private int productId;

    @Column(name = "p_category")
    private String category;

    @Column(name = "p_name")
    private String name;

    @Column(name = "brand")
    private String brand;

    @Column(name = "price", precision = 12, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "P_stock")
    private Integer stock;

    @Column(name = "is_delete", nullable = false, columnDefinition = "boolean default true")
    private boolean isDelete = true;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;                              // ← NEW

    @JsonIgnore
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<SalesItem> salesItems;

    public Product() {}

    public Product(String category, String name, String brand, BigDecimal price, Integer stock) {
        this.category = category;
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.stock = stock;
    }

    public int getProductId() { return productId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public boolean getIsDelete() { return isDelete; }
    public void setIsDelete(boolean isDelete) { this.isDelete = isDelete; }

    public User getOwner() { return owner; }          // ← NEW
    public void setOwner(User owner) { this.owner = owner; }  // ← NEW

    public List<SalesItem> getSalesItems() { return salesItems; }
    public void setSalesItems(List<SalesItem> salesItems) { this.salesItems = salesItems; }
}
