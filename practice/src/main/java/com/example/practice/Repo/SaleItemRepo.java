package com.example.practice.Repo;

import com.example.practice.Entity.SalesItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface SaleItemRepo extends JpaRepository<SalesItem, Integer> {

    List<SalesItem> findByProduct_ProductId(int productId);

    @Query("select coalesce(sum(item.amount), 0) from SalesItem item where item.sale.saleId = :saleId")
    BigDecimal sumAmountBySaleId(@Param("saleId") int saleId);

    int countBySale_SaleId(int saleId);
}
