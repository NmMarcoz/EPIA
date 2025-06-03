use reqwest;
use serde::{Deserialize, Serialize};
use crate::utils;

const BASE_URL: &str = "localhost:3000";

#[derive(Debug)]
pub enum ApiError {
    RequestError(reqwest::Error),
    JsonError(String),
}

impl From<reqwest::Error> for ApiError {
    fn from(err: reqwest::Error) -> Self {
        ApiError::RequestError(err)
    }
}

#[derive(Serialize,Deserialize)]
pub struct Worker {
    id: String,
    name: String,
    registration_number: String,
    email: String,
    function: String,
    card_id: String
}

pub async fn get_worker(card_id: String) -> Result<Worker, ApiError> {
    let resp = reqwest::get(format!("{}/workers/card_id/{}", BASE_URL, card_id))
        .await?;
    
    let worker: Worker = resp.json()
        .await
        .map_err(|e| ApiError::JsonError(e.to_string()))?;
    utils::jsonutils::pretty_json(&worker);
    Ok(worker)
}