package com.banhang.banhang.Service;

import com.banhang.banhang.Repository.OrderDetailRepository;
import com.banhang.banhang.Repository.OrdersRepository;
import com.banhang.banhang.Repository.ProductRepository;
import com.banhang.banhang.entity.OrderDetail;
import com.banhang.banhang.entity.Orders;
import com.banhang.banhang.entity.Product;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;

@Service
public class ReportService {

    private final ProductRepository productRepository;
    private final OrdersRepository ordersRepository;
    private final OrderDetailRepository orderDetailRepository;

    public ReportService(
            ProductRepository productRepository,
            OrdersRepository ordersRepository,
            OrderDetailRepository orderDetailRepository) {

        this.productRepository = productRepository;
        this.ordersRepository = ordersRepository;
        this.orderDetailRepository = orderDetailRepository;
    }

    public byte[] exportProductsPdf() throws Exception {

        List<Product> products = productRepository.findAll();

        InputStream inputStream =
                new ClassPathResource("reports/product_report.jrxml")
                        .getInputStream();

        JasperReport jasperReport =
                JasperCompileManager.compileReport(inputStream);

        JRBeanCollectionDataSource dataSource =
                new JRBeanCollectionDataSource(products);

        JasperPrint jasperPrint =
                JasperFillManager.fillReport(
                        jasperReport,
                        new HashMap<>(),
                        dataSource);

        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    public byte[] exportOrderPdf(Integer orderId) throws Exception {

        Orders order =
                ordersRepository.findById(orderId)
                        .orElseThrow();

        List<OrderDetail> details =
                orderDetailRepository.findByOrderId(orderId);

        InputStream inputStream =
                new ClassPathResource("reports/order_invoice.jrxml")
                        .getInputStream();

        JasperReport jasperReport =
                JasperCompileManager.compileReport(inputStream);

        JRBeanCollectionDataSource dataSource =
                new JRBeanCollectionDataSource(details);

        HashMap<String, Object> params = new HashMap<>();

        params.put("orderId", order.getId());
        params.put("customerId", order.getCustomerId());
        params.put("total", order.getTotal());

        JasperPrint jasperPrint =
                JasperFillManager.fillReport(
                        jasperReport,
                        params,
                        dataSource);

        return JasperExportManager.exportReportToPdf(jasperPrint);
    }
}