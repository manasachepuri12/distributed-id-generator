package com.example.id_generator;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class IdController {

    private final SnowflakeIdGenerator idGenerator;

    public IdController(
            @Value("${DATACENTER_ID:1}") long datacenterId,
            @Value("${MACHINE_ID:1}") long machineId) {

        this.idGenerator = new SnowflakeIdGenerator(
                datacenterId,
                machineId
        );
    }

    @GetMapping("/id")
    public SnowflakeIdGenerator.IdDetails generateId() {
        return idGenerator.generateIdDetails();
    }
}