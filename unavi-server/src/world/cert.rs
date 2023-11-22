use rcgen::{BasicConstraints, Certificate, CertificateParams, IsCa, KeyUsagePurpose};
use time::{Duration, OffsetDateTime};

/// Generate a new CA certificate
pub fn new_ca() -> Certificate {
    let mut params = CertificateParams::new(Vec::default());

    let (yesterday, tomorrow) = validity_period();

    params.is_ca = IsCa::Ca(BasicConstraints::Unconstrained);
    params.key_usages.push(KeyUsagePurpose::DigitalSignature);
    params.key_usages.push(KeyUsagePurpose::KeyCertSign);
    params.key_usages.push(KeyUsagePurpose::CrlSign);
    params.not_before = yesterday;
    params.not_after = tomorrow;

    Certificate::from_params(params).unwrap()
}

fn validity_period() -> (OffsetDateTime, OffsetDateTime) {
    let day = Duration::new(86400, 0);
    let yesterday = OffsetDateTime::now_utc().checked_sub(day).unwrap();
    let tomorrow = OffsetDateTime::now_utc().checked_add(day).unwrap();
    (yesterday, tomorrow)
}
