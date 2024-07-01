package com.example.logging;

import org.apache.logging.log4j.core.LogEvent;
import org.apache.logging.log4j.core.config.plugins.Plugin;
import org.apache.logging.log4j.core.layout.AbstractStringLayout;
import org.apache.logging.log4j.core.layout.JsonTemplateLayout;
import org.apache.logging.log4j.core.layout.JsonTemplateLayout.Builder;
import org.apache.logging.log4j.core.util.StringBuilderWriter;

import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

@Plugin(name = "CustomJsonTemplateLayout", category = "Core", elementType = "layout", printObject = true)
public class CustomJsonTemplateLayout extends JsonTemplateLayout {

    public CustomJsonTemplateLayout(Configuration config, Builder builder) {
        super(config, builder);
    }

    @Override
    public byte[] toByteArray(LogEvent event) {
        long processingTime = System.currentTimeMillis() - event.getTimeMillis();
        Map<String, Object> customFields = new HashMap<>();
        customFields.put("processingTime", processingTime);

        StringBuilderWriter writer = new StringBuilderWriter();
        super.encode(event, writer, customFields);
        return writer.toString().getBytes(Charset.defaultCharset());
    }
}


<?xml version="1.0" encoding="UTF-8"?>
<Configuration>
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <CustomJsonTemplateLayout>
                <EventTemplateUri>classpath:log4j2-template.json</EventTemplateUri>
            </CustomJsonTemplateLayout>
        </Console>
    </Appenders>

    <Loggers>
        <Root level="INFO">
            <AppenderRef ref="Console"/>
        </Root>
    </Loggers>
</Configuration>


com.example.logging.CustomJsonTemplateLayout


