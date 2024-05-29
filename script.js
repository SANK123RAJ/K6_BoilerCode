import java.util.List;
import java.util.Map;

public class AbFramework {

    private static final List<Map<String, String>> TEST_ARRAY = List.of(
        Map.of("impression_table", "weightage_pg_selection_impression", "test_name", AbTestFactory.WEIGHTAGE_TEST)
    );

    private static String testName = null;
    private static ParikshaUtility parikshaUtility = null;
    private static AbTest testInstance = null;

    public static AbTest getTestInstance(Transaction transaction) {
        if (testInstance != null) {
            return testInstance;
        }

        boolean enableNewRouting = getFeatureValue(transaction.getMerchant(), "enable_new_health_routing");

        if (enableNewRouting && List.of("CC", "DC").contains(transaction.getMode())) {
            return testInstance = AbTestFactory.getInstance(AbTestFactory.WEIGHTAGE_TEST);
        }

        for (Map<String, String> test : TEST_ARRAY) {
            parikshaUtility = new ParikshaUtility(
                test.get("impression_table"),
                test.get("test_name"),
                transaction.getMerchant()
            );
            parikshaUtility.setIdentifier(transaction.getId());
            parikshaUtility.setCustomProperty(Map.of(
                "mode", transaction.getMode(),
                "merchant", String.valueOf(transaction.getMerchant().getId()),
                "ibiboCode", transaction.getIbiboCode(),
                "network_scheme", transaction.getBinInfo().get("card_type"),
                "paymentSource", transaction.getPaymentSource()
            ));

            if (parikshaUtility.isFeatureEnabled()) {
                testName = test.get("test_name");
                Logger.log(testName + " test selected for this transaction");
                break;
            }
        }

        return testInstance = AbTestFactory.getInstance(testName);
    }

    private static boolean getFeatureValue(Merchant merchant, String featureName) {
        // Implementation to get feature value (mocked)
        // This should actually retrieve the feature flag value from your feature management system
        return true;
    }
}
//next







import no.finn.unleash.DefaultUnleash;
import no.finn.unleash.Unleash;
import no.finn.unleash.util.UnleashConfig;

import java.util.Map;

public class ParikshaUtility {
    private String impressionTable;
    private String testName;
    private Merchant merchant;
    private String identifier;
    private Map<String, String> customProperty;
    private Unleash unleash;

    public ParikshaUtility(String impressionTable, String testName, Merchant merchant) {
        this.impressionTable = impressionTable;
        this.testName = testName;
        this.merchant = merchant;

        UnleashConfig config = UnleashConfig.builder()
            .appName("my.java-app")
            .instanceId("your-instance-1")
            .unleashAPI("<unleash-api-url>")
            .apiKey("<client-api-token>")
            .build();

        this.unleash = new DefaultUnleash(config);
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public void setCustomProperty(Map<String, String> customProperty) {
        this.customProperty = customProperty;
    }

    public boolean isFeatureEnabled() {
        // Assuming the testName is used as the feature toggle name
        return unleash.isEnabled(testName);
    }
}
