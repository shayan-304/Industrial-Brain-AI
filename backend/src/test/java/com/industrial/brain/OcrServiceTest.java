package com.industrial.brain;

import com.industrial.brain.service.OcrService;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class OcrServiceTest {

    private final OcrService ocrService = new OcrService();

    @Test
    public void testPumpFallbackOcrText() {
        MockMultipartFile mockFile = new MockMultipartFile(
                "file", "intake_pump_p101_inspection.png", "image/png", new byte[]{1, 2, 3}
        );

        String result = ocrService.extractText(mockFile);
        assertTrue(result.contains("Asset ID: P-101"), "OCR response should contain the P-101 ID");
        assertTrue(result.contains("Centrifugal Water Pump"), "OCR response should match the pump text template");
    }

    @Test
    public void testBoilerFallbackOcrText() {
        MockMultipartFile mockFile = new MockMultipartFile(
                "file", "boiler_B12_casing_rust.png", "image/png", new byte[]{4, 5, 6}
        );

        String result = ocrService.extractText(mockFile);
        assertTrue(result.contains("Asset ID: B-12"), "OCR response should contain the B-12 ID");
        assertTrue(result.contains("OSHA 1910.111"), "OCR response should cite OSHA pressure vessel regulation");
    }

    @Test
    public void testGasProtocolFallbackOcrText() {
        MockMultipartFile mockFile = new MockMultipartFile(
                "file", "safety_gas_leak_sop.jpg", "image/jpeg", new byte[]{7, 8, 9}
        );

        String result = ocrService.extractText(mockFile);
        assertTrue(result.contains("SOP-SAF-042"), "OCR response should contain SOP identifier");
        assertTrue(result.contains("isolation"), "OCR response should mention isolation steps");
    }
}
