use reqwest;
use serde::{Deserialize, Serialize};
use crate::utils;

//const BASE_URL: &str = "https://r97rgdpr-3000.brs.devtunnels.ms";

const BASE_URL: &str = "http://localhost:3000";

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
    registrationNumber: String,
    email: String,
    function: String,
    cardId: String
}

pub async fn get_worker(card_id: String) -> Result<Worker, ApiError> {
    println!("Iniciando busca do worker com card_id: {}", card_id);
    let url = format!("{}/workers/cardId/{}", BASE_URL, card_id);
    println!("{}", url);
    let resp = reqwest::get(url)
        .await?;
    
    let worker: Worker = resp.json()
        .await
        .map_err(|e| ApiError::JsonError(e.to_string()))?;
    utils::jsonutils::pretty_json(&worker);
    Ok(worker)
}