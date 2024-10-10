@extends('client.master')
@section('content')
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
        }

        .container {
            padding: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            table-layout: fixed;
        }

        th,
        td {
            padding: 10px;
            border: 1px solid #ccc;
        }

        th {
            background-color: #f4f4f4;
        }

        .event {
            padding: 10px;
            color: white;
            border-radius: 8px;
        }

        .dance {
            background-color: #00bcd4;
        }

        .yoga {
            background-color: #4caf50;
        }

        .music {
            background-color: #ffeb3b;
            color: black;
        }

        .art {
            background-color: #9c27b0;
        }

        .english {
            background-color: #e91e63;
        }

        .break {
            background-color: #ff5722;
        }
    </style>
    <div class="breadcrumbs-area">
        {{-- <h3>Admin Dashboard</h3> --}}
        <ul>
            <li>
                <a href="index.html">Trang chủ</a>
            </li>
            <li>Lịch học</li>
        </ul>
    </div>
    <div class="col-12-xxxl col-12">
        <div class="card dashboard-card-six">
            <div class="card-body">
                <div class="container">
                    <table>
                        <thead>
                            <tr>
                                <th>THỜI GIAN</th>
                                <th>THỨ HAI</th>
                                <th>THỨ BA</th>
                                <th>THỨ TƯ</th>
                                <th>THỨ NĂM</th>
                                <th>THỨ SÁU</th>
                                <th>THỨ BẢY</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Ca 1</td>
                                <td>
                                    <div class="event dance">Pháp luật<br>7:10-9:10<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                   
                                </td>
                                <td>
                                    <div class="event dance">Pháp luật<br>7:10-9:10<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                 
                                </td>
                                <td>
                                    <div class="event dance">Pháp luật<br>7:10-9:10<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                  
                                </td>
                            </tr>
                            <tr>
                                <td>Ca 2</td>
                                <td>
                                   
                                </td>
                                <td>
                                    <div class="event music">Lập trình PHP2<br>9:20-11:20<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                              
                                </td>
                                <td>
                                    <div class="event music">Lập trình PHP2<br>9:20-11:20<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                  
                                </td>
                                <td>
                                    <div class="event music">Lập trình PHP2<br>9:20-11:20<br><small>baovvph36087</small></div>
                                </td>
                            </tr>
                            <tr>
                                <td>Ca 3</td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                            </tr>
                            <tr>
                                <td>Ca 4</td>
                                <td>
                                    <div class="event yoga">Quản trị Website<br>14:10-16:10<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                  
                                </td>
                                <td>
                                    <div class="event yoga">Quản trị Website<br>14:10-16:10<br><small>baovvph36087</small></div>
                                </td>
                                <td>
                                  
                                </td>
                                <td>
                                    <div class="event yoga">Quản trị Website<br>14:10-16:10<br><small>baovvph36087</small></div>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Ca 5</td>
                                <td>
                                   
                                </td>
                                <td>
                                    <div class="event english">Chính trị<br>16:20-18:20<br><small>baovvph36087</small></div>
                                </td>
                                <td></td>
                                <td>
                                    <div class="event english">Chính trị<br>16:20-18:20<br><small>baovvph36087</small></div>
                                </td>
                                <td></td>
                                <td>
                                    <div class="event english">Chính trị<br>16:20-18:20<br><small>baovvph36087</small></div>
                                </td>
                            </tr>
                            <tr>
                                <td>Ca 6</td>
                                <td>
                                  
                                </td>
                                <td>
                                 
                                </td>
                                <td></td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                              
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
            </div>
        </div>
    </div>
@endsection
