package com.example.id_generator;

public class SnowflakeIdGenerator {

    // Custom epoch: January 1, 2025
    private static final long CUSTOM_EPOCH = 1735689600000L;

    // Snowflake bit allocation
    private static final long DATACENTER_ID_BITS = 5L;
    private static final long MACHINE_ID_BITS = 5L;
    private static final long SEQUENCE_BITS = 12L;

    // Maximum values
    private static final long MAX_DATACENTER_ID =
            ~(-1L << DATACENTER_ID_BITS);

    private static final long MAX_MACHINE_ID =
            ~(-1L << MACHINE_ID_BITS);

    // Bit shifts
    private static final long MACHINE_ID_SHIFT = SEQUENCE_BITS;

    private static final long DATACENTER_ID_SHIFT =
            SEQUENCE_BITS + MACHINE_ID_BITS;

    private static final long TIMESTAMP_SHIFT =
            SEQUENCE_BITS + MACHINE_ID_BITS + DATACENTER_ID_BITS;

    // Sequence
    private long sequence = 0L;

    // Last generated timestamp
    private long lastTimestamp = -1L;

    private final long datacenterId;
    private final long machineId;

    public SnowflakeIdGenerator(long datacenterId, long machineId) {

        if (datacenterId < 0 || datacenterId > MAX_DATACENTER_ID) {
            throw new IllegalArgumentException(
                    "Datacenter ID must be between 0 and "
                            + MAX_DATACENTER_ID
            );
        }

        if (machineId < 0 || machineId > MAX_MACHINE_ID) {
            throw new IllegalArgumentException(
                    "Machine ID must be between 0 and "
                            + MAX_MACHINE_ID
            );
        }

        this.datacenterId = datacenterId;
        this.machineId = machineId;
    }

    public synchronized long generateId() {

        long currentTimestamp = System.currentTimeMillis();

        if (currentTimestamp < lastTimestamp) {
            throw new RuntimeException(
                    "Clock moved backwards. Refusing to generate ID."
            );
        }

        if (currentTimestamp == lastTimestamp) {

            sequence = (sequence + 1) & 4095;

            if (sequence == 0) {
                currentTimestamp = waitForNextMillis(lastTimestamp);
            }

        } else {
            sequence = 0;
        }

        lastTimestamp = currentTimestamp;

        return ((currentTimestamp - CUSTOM_EPOCH) << TIMESTAMP_SHIFT)
                | (datacenterId << DATACENTER_ID_SHIFT)
                | (machineId << MACHINE_ID_SHIFT)
                | sequence;
    }

    /**
     * Generates an ID and returns its individual components.
     */
    public synchronized IdDetails generateIdDetails() {

        long currentTimestamp = System.currentTimeMillis();

        if (currentTimestamp < lastTimestamp) {
            throw new RuntimeException(
                    "Clock moved backwards. Refusing to generate ID."
            );
        }

        if (currentTimestamp == lastTimestamp) {

            sequence = (sequence + 1) & 4095;

            if (sequence == 0) {
                currentTimestamp = waitForNextMillis(lastTimestamp);
            }

        } else {
            sequence = 0;
        }

        lastTimestamp = currentTimestamp;

        long id = ((currentTimestamp - CUSTOM_EPOCH) << TIMESTAMP_SHIFT)
                | (datacenterId << DATACENTER_ID_SHIFT)
                | (machineId << MACHINE_ID_SHIFT)
                | sequence;

        return new IdDetails(
                id,
                currentTimestamp,
                datacenterId,
                machineId,
                sequence
        );
    }

    private long waitForNextMillis(long lastTimestamp) {

        long timestamp = System.currentTimeMillis();

        while (timestamp <= lastTimestamp) {
            timestamp = System.currentTimeMillis();
        }

        return timestamp;
    }

    public record IdDetails(
            long id,
            long timestamp,
            long datacenterId,
            long machineId,
            long sequence
    ) {
    }
}