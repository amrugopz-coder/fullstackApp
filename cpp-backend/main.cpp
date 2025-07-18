#include "crow_all.h"
#include <nlohmann/json.hpp>


int countWords(const std::string& str) {
    std::istringstream iss(str);
    return std::distance(std::istream_iterator<std::string>(iss), std::istream_iterator<std::string>());
}

int main() {
    crow::App<crow::CORSHandler> app; 

    auto& cors = app.get_middleware<crow::CORSHandler>();
    cors.global()
        .origin("*") // Allow all origins
        .methods(crow::HTTPMethod::GET, crow::HTTPMethod::POST, crow::HTTPMethod::OPTIONS) // Specify allowed methods
        .headers("Content-Type", "Access-Control-Allow-Origin") // Specify allowed headers
        .max_age(3600); // Cache preflight response for 1 hour

   

    // 🔹 POST route with CORS headers
    CROW_ROUTE(app, "/analyze").methods("POST"_method)([](const crow::request& req, crow::response& res) {
       
        try {
            auto body = nlohmann::json::parse(req.body);
            std::string text = body["text"];
            int wordCount = countWords(text);

            nlohmann::json result = {{"wordCount", wordCount}};
            res.set_header("Content-Type", "application/json");
            res.write(result.dump());
            res.code = 200;
        } catch (const std::exception& e) {
            res.code = 400;
            res.write(std::string("JSON Parse Error: ") + e.what());
        }

        res.end();
    });

    std::cout << "🚀 Crow API running on port 8080\n";
    app.port(8080).multithreaded().run();
}
